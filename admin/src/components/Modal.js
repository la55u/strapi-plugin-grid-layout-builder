import { Button } from "@buffetjs/core";
import React, { useRef } from "react";
import { FormattedMessage } from "react-intl";
import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter,
} from "strapi-helper-plugin";
import styled from "styled-components";
import pluginId from "../pluginId";
import { GridEditor } from "./GridEditor";

export const LayoutEditorModal = ({ isOpen, onToggle, onChange, value }) => {
  const layoutRef = useRef();

  const onLayoutChange = (layout) => {
    console.log("Layout changed:", layout);
    layoutRef.current = layout;
  };

  const onSubmit = async () => {
    console.log("Submitting...", layoutRef);
    onChange({
      target: { name: "layout", value: layoutRef.current },
    });
    onToggle();
  };

  const StyledModal = styled(Modal)`
    max-width: 100vw !important;
    margin: 0 !important;
    > .modal-content {
      height: 100vh;
    }
  `;

  const StyledModaBody = styled(ModalBody)`
    display: flex;
    width: 100%;
    max-width: 1000px;
    margin: auto;
    overflow-y: auto;
    max-height: 80vh;
  `;

  return (
    <StyledModal isOpen={isOpen} onToggle={onToggle}>
      <HeaderModal>
        <section>
          <HeaderModalTitle style={{ textTransform: "none" }}>
            <FormattedMessage id={`${pluginId}.modal.title`} />
          </HeaderModalTitle>
        </section>
      </HeaderModal>

      <StyledModaBody>
        <GridEditor onChange={onLayoutChange} value={value} />
      </StyledModaBody>

      <ModalFooter>
        <section>
          <Button onClick={onToggle} color="cancel">
            <FormattedMessage id="app.components.Button.cancel" />
          </Button>
          <Button color="success" onClick={onSubmit}>
            <FormattedMessage id={`${pluginId}.modal.button.save`} />
          </Button>
        </section>
      </ModalFooter>
    </StyledModal>
  );
};
