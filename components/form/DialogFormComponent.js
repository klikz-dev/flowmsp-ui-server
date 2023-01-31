import React from "react";
import { Button } from "react-bootstrap";
import { styles } from "../../styles/confirm-form.module.scss";

class DialogForm extends React.Component {
  constructor(props) {
    super();
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleConfirm() {
    if (this.props.form) {
      this.props.onConfirm(this.props.form);
    } else {
      this.props.onConfirm();
    }
  }

  render() {
    return (
      <div style={styles}>
        <form className="confirm">
          <div>{this.props.body}</div>
          <div className="actions">
            <Button onClick={this.handleConfirm} bsStyle="primary">
              OK
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default DialogForm;
