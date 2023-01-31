import React from "react";
import { FieldGroup } from "./FieldGroup";
import {
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
  Form,
} from "react-bootstrap";
import { styles } from "../../styles/common-form.module.scss";
import { dpstyles } from "../../styles/react-datepicker.module.scss";
import DatePicker from "react-datepicker";
import moment from "moment";

class FormComponent extends React.Component {
  constructor(props) {
    super();
    this.state = { form: props.form };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
  }

  onChange(event) {
    const field = event.target.name;
    const form = this.state.form;
    if (event.target.type === "checkbox") {
      form[field] = event.target.checked;
    } else {
      form[field] =
        event.target.type === "number" && event.target.value
          ? Number(event.target.value)
          : event.target.value;
    }
    this.setState({ form: form });
    if (this.props.handleFormChange) {
      this.props.handleFormChange(form);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.handleFormSubmit(this.state.form);
  }

  onConfirmPasswordChange(event) {
    if (event.target.value === "") {
      event.target.setCustomValidity("Please fill out this field.");
    } else if (event.target.value !== this.state.form.password) {
      event.target.setCustomValidity(
        "Please enter the same Password as above."
      );
    } else {
      event.target.setCustomValidity("");
    }
  }

  renderOptions = (formField) => {
    return formField.options.map(function (option, index) {
      return (
        <option key={index} value={option.value}>
          {option.key}
        </option>
      );
    });
  };

  getlabel = (field) => {
    if (field.labelType === "jsx" && field.label.htmlTagType === "link") {
      return (
        <div>
          <span>{field.label.preLinkText}</span>
          <span>
            <a href={field.label.href} target="_blank" rel="noreferrer">
              {field.label.linkText}
            </a>
          </span>
          <span>{field.label.postLinkText}</span>
          {field.label && field.required && (
            <span className="required-label">*</span>
          )}
        </div>
      );
    }
    return field.label;
  };

  hanldRawChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    const date = moment(value);
    if (!date.isValid()) {
      event.target.setCustomValidity("Invalid date is selected");
    } else {
      event.target.setCustomValidity("");
      const form = this.state.form;
      form[field] = date;
      this.setState({ form: form });
    }
  };

  handleSelect = (date, event) => {
    const field = event.target.name;
    const ta = event.target;
    const formgroup = ta.closest(".form-group");
    if (formgroup) {
      const targetElement = formgroup.querySelector("input");
      const filedName = targetElement.name;
      const form = this.state.form;
      form[filedName] = date;
      this.setState({ form: form });
    }
  };

  render() {
    const getFormFieldProps = (formField, index) => {
      const formFieldProps = { ...formField };
      formFieldProps.key = index;
      formFieldProps.value = this.state.form[formField.name];
      formFieldProps.onChange = this.onChange;
      if (formFieldProps.confirmPasswordCheck) {
        formFieldProps.onInput = this.onConfirmPasswordChange;
        delete formFieldProps.confirmPasswordCheck;
      }
      return formFieldProps;
    };

    return (
      <div style={styles}>
        <form className="common-form" onSubmit={this.onSubmit}>
          {this.props.formFields.map((formField, index) => {
            if (formField.type === "static") {
              return (
                <FormGroup key={index}>
                  <FormLabel>{formField.label}</FormLabel>
                  <FormControl.Static>
                    {this.state.form[formField.name]}
                  </FormControl.Static>
                </FormGroup>
              );
            }
            if (formField.type === "example") {
              return (
                <FormGroup key={index}>
                  <FormControl.Static>
                    {this.state.form[formField.name]}
                  </FormControl.Static>
                </FormGroup>
              );
            }
            if (formField.type === "checkbox") {
              return (
                <FormGroup key={index}>
                  <Form.Check
                    onChange={this.onChange.bind(this)}
                    name={formField.name}
                    required={formField.required ? true : false}
                  >
                    {this.getlabel(formField)}
                  </Form.Check>
                </FormGroup>
              );
            }
            if (formField.type === "date") {
              return (
                <FormGroup key={index}>
                  <FormLabel>
                    {formField.label}{" "}
                    {formField.label && formField.required && (
                      <span className="required-label">*</span>
                    )}{" "}
                  </FormLabel>
                  <DatePicker
                    className="form-control"
                    name={formField.name}
                    selected={this.state.form[formField.name]}
                    onChangeRaw={this.hanldRawChange}
                    onSelect={this.handleSelect}
                    dateFormat="YYYY-MM-DD"
                    minDate={new Date()}
                    required={formField.required}
                  />
                </FormGroup>
              );
            }
            if (formField.type === "datefree") {
              return (
                <FormGroup key={index}>
                  <FormLabel>
                    {formField.label}{" "}
                    {formField.label && formField.required && (
                      <span className="required-label">*</span>
                    )}{" "}
                  </FormLabel>
                  <DatePicker
                    className="form-control"
                    name={formField.name}
                    selected={this.state.form[formField.name]}
                    onChangeRaw={this.hanldRawChange}
                    onSelect={this.handleSelect}
                    dateFormat="YYYY-MM-DD"
                    required={formField.required}
                  />
                </FormGroup>
              );
            }
            if (formField.type === "textarea") {
              return (
                <FormGroup key={index}>
                  <FormLabel>{formField.label}</FormLabel>
                  <FormControl
                    value={this.state.form[formField.name]}
                    componentClass="textarea"
                    required={
                      formField.label && formField.required ? true : false
                    }
                    name={formField.name}
                    onChange={this.onChange.bind(this)}
                    rows={5}
                  />
                </FormGroup>
              );
            }
            if (formField.type === "select") {
              return (
                <FormGroup key={index}>
                  <FormLabel>
                    {formField.label}{" "}
                    {formField.label && formField.required && (
                      <span className="required-label">*</span>
                    )}{" "}
                  </FormLabel>
                  <FormControl
                    value={this.state.form[formField.name]}
                    componentClass="select"
                    required={
                      formField.label && formField.required ? true : false
                    }
                    name={formField.name}
                    onChange={this.onChange.bind(this)}
                  >
                    {this.renderOptions(formField)}
                  </FormControl>
                </FormGroup>
              );
            }
            return (
              <FieldGroup
                {...getFormFieldProps(formField, index)}
                key={index}
              />
            );
          })}
          <div className="form-footer">
            {this.props.errorMessage && (
              <Alert bsStyle="danger">
                <strong>Error!</strong> {this.props.errorMessage}.
              </Alert>
            )}
            {this.props.showCancelButton && (
              <Button onClick={this.props.onCancel}>Cancel</Button>
            )}
            <Button
              type="submit"
              bsStyle="primary"
              disabled={this.props.isFormSubmitting ? true : false}
            >
              {this.props.isFormSubmitting ? "Submitting" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default FormComponent;
