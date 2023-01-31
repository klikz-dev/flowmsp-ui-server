import React from "react";
import { Button } from "react-bootstrap";
import { styles } from "../../styles/confirm-form.module.scss";

class ConfirmForm extends React.Component {
  constructor(props) {
    super();
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
  }

  handleConfirm() {
    if (this.props.form) {
      this.props.onConfirm(this.props.form);
    } else {
      this.props.onConfirm();
    }
  }

  handleDecline() {
    this.props.onDecline();
  }

  render() {
    return (
      <div style={styles}>
        <form className="confirm">
          <div>{this.props.body}</div>
          <div className="actions">
            <Button onClick={this.handleDecline}>No</Button>
            <Button onClick={this.handleConfirm} bsStyle="primary">
              Yes
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default ConfirmForm;
