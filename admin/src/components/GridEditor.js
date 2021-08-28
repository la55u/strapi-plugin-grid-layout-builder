import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  InputNumber,
  Label,
  useContentManagerEditViewDataManager,
} from "strapi-helper-plugin";
import styled from "styled-components";
import "./grid.css";
import { Button } from "@buffetjs/core";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
`;
const StyledComponentList = styled.div``;
const StyledComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  background: #bec8db;
  padding: 10px;
  user-select: none;
  cursor: move;
  min-width: 100px;
`;
const StyledNewItemsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledFieldset = styled.fieldset`
  border: 2px dashed lightgrey;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
`;
const StyledLegend = styled.legend`
  padding-left: 0;
  padding-right: 0;
  display: inline;
  width: auto;
  font-size: 16px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: 600;
`;

const StyledTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

export const GridEditor = ({ onChange, value }) => {
  const [nonArrangedComponents, setNonArrangedComponents] = useState([]); // they appear in the upper box
  const [arrangedComponents, setArrangedComponents] = useState([]); // they appear in the bottom box
  const [draggingItem, setDraggingItem] = useState({ id: "", uid: "" }); // {id,uid} of the component currently being dragged
  const initialColCount = value ? Math.max(...value.map((l) => l.x + l.w)) : 2;
  const [columns, setColumns] = useState(initialColCount);

  const {
    layout: { attributes },
    allLayoutData: { components }, // component's meta data
    modifiedData,
    ...rest
  } = useContentManagerEditViewDataManager();

  console.log("attributes:", attributes); // current entity's schema
  console.log("all:", components);
  console.log("modified:", modifiedData); // current entity's values

  const mappedComps = useMemo(() => {
    const dzField = Object.keys(attributes).find(
      (a) => attributes[a].type === "dynamiczone"
    );
    if (!dzField || !modifiedData[dzField]) return [];
    return modifiedData[dzField].map((c) => ({
      uid: c.__component,
      id: c.id,
    }));
  }, []);

  useEffect(() => {
    const valueIds = value ? value.map((val) => val.i.split("__")[0]) : [];
    const nonArranged = mappedComps.filter((c) => !valueIds.includes(c.id));
    const arranged = value
      ? mappedComps
          .filter((c) => valueIds.includes(c.id))
          .map((c) => {
            const lo = value.find((l) => l.i.split("__")[0] === c.id);
            return { comp: { ...c }, layout: lo };
          })
      : [];
    setArrangedComponents(arranged);
    setNonArrangedComponents(nonArranged);
  }, []);

  const onDragStart = (e) => {
    // this is a hack for firefox
    // Firefox requires some kind of initialization
    // which we can do by adding this attribute
    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
    e.dataTransfer.setData("text/plain", "");

    setDraggingItem({
      uid: e.target.getAttribute("data-uid"),
      id: e.target.getAttribute("data-id"),
    });
  };

  const onDrop = (layout, layoutItem, _event) => {
    if (!layoutItem) return;
    //alert(JSON.stringify(layoutItem, null, 2));
    setNonArrangedComponents((comp) =>
      comp.filter((c) => c.id !== draggingItem.id)
    );
    setArrangedComponents((comps) => {
      const temp = [...comps];
      const idx = layoutItem.y * 3 + layoutItem.x;
      temp.splice(idx, 0, { comp: draggingItem, layout: layoutItem });
      return temp;
    });
  };

  const handleReset = () => {
    onChange(null);
    setArrangedComponents([]);
    setNonArrangedComponents(mappedComps);
  };

  const handleColChange = (e) => {
    const { value } = e.target;
    if (value > 0) setColumns(value);
  };

  if (!components) return "Loading...";

  return (
    <StyledWrapper>
      <StyledTop>
        <div style={{ alignSelf: "start" }}>
          <Label htmlFor="colcnt" message={"Column count"} />
          <InputNumber id="colcnt" value={columns} onChange={handleColChange} />
        </div>
        <Button color="delete" onClick={handleReset}>
          Reset
        </Button>
      </StyledTop>

      <StyledFieldset>
        <StyledLegend>Available components</StyledLegend>
        <StyledNewItemsList>
          {nonArrangedComponents.map((comp, i) => (
            <StyledComponent
              key={comp.id}
              data-uid={comp.uid}
              data-id={comp.id}
              onDragStart={onDragStart}
              draggable={true}
            >
              <FontAwesomeIcon icon={components[comp.uid].info.icon} />
              <div>{components[comp.uid].info.name}</div>
            </StyledComponent>
          ))}
          {nonArrangedComponents.length === 0 && (
            <p>You're all set, everything is arranged on the page!</p>
          )}
        </StyledNewItemsList>
      </StyledFieldset>

      <FontAwesomeIcon icon="arrow-down" size="lg" />

      <StyledFieldset>
        <StyledLegend>Page components</StyledLegend>
        <StyledComponentList>
          <ResponsiveReactGridLayout
            className="layout"
            //layouts={layout}
            cols={{ xs: columns, sm: columns, md: columns, lg: columns }}
            margin={[10, 10]}
            rowHeight={70}
            width={1000}
            compactType="vertical"
            isDroppable={true}
            onDrop={onDrop}
            droppingItem={{
              i: `${draggingItem.id}__${draggingItem.uid}`,
              w: 1,
              h: 1,
            }}
            containerPadding={[0, 0]}
            measureBeforeMount={false}
            onLayoutChange={onChange}
          >
            {arrangedComponents.length > 0
              ? arrangedComponents.map((ac, i) => (
                  <div
                    key={`${ac.comp.id}__${ac.comp.uid}`}
                    data-grid={{ ...ac.layout }}
                  >
                    <FontAwesomeIcon
                      size="lg"
                      icon={components[ac.comp.uid].info.icon}
                    />
                    <div>{components[ac.comp.uid].info.name}</div>
                  </div>
                ))
              : arrangedComponents.length === 0 && (
                  <div key="placeholder" data-grid={{ x: 0, y: 0, w: 1, h: 1 }}>
                    None of the components are positioned yet. Drag them here
                    from the box above!
                  </div>
                )}
          </ResponsiveReactGridLayout>
        </StyledComponentList>
      </StyledFieldset>
    </StyledWrapper>
  );
};
