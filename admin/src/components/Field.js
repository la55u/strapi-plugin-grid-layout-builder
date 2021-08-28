import { isEmpty } from "lodash";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { InputDescription, InputErrors, Label } from "strapi-helper-plugin";
import pluginId from "../pluginId";
import { LayoutEditorModal } from "./Modal";
import { Button } from "@buffetjs/core";

export const Field = ({
  inputDescription,
  errors,
  label,
  name,
  noErrorsDescription,
  onChange,
  value,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Label htmlFor={name} message={label} style={{ marginBottom: 10 }} />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button onClick={() => setIsOpen(true)}>
          <FormattedMessage id={`${pluginId}.form.button.edit`} />
        </Button>
        {!value ? (
          <FormattedMessage id={`${pluginId}.form.button.nolayout`} />
        ) : (
          <FormattedMessage id={`${pluginId}.form.button.customlayout`} />
        )}
      </div>

      <InputDescription
        message={inputDescription}
        style={!isEmpty(inputDescription) ? { marginTop: "1.4rem" } : {}}
      />
      <InputErrors
        errors={(!noErrorsDescription && errors) || []}
        name={name}
      />
      <LayoutEditorModal
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
