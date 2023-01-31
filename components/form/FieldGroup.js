import React from "react";
import { FormGroup, FormLabel, FormControl, FormText } from "react-bootstrap";

export function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <FormLabel>{label}</FormLabel>
      {label && props.required && <span className="required-label">*</span>}
      <FormControl {...props} />
      {help && <FormText>{help}</FormText>}
    </FormGroup>
  );
}
