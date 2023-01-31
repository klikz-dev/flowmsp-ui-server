import React from "react";
import { Modal, Button } from "react-bootstrap";
import { styles } from "../../styles/modal.module.scss";

class ModalComponent extends React.Component {
  constructor(props) {
    super();
    this.close = this.close.bind(this);
  }

  close() {
    this.props.toggleModal();
  }

  render() {
    const modal = this.props.modal;
    return (
      <div style={styles}>
        <Modal show={this.props.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{modal?.heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modal?.body}</Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ModalComponent;
