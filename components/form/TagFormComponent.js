import React from "react";
import { Button } from "react-bootstrap";
import { styles } from "../../styles/reactTagsPDF.module.scss";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

class ConfirmForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags ? this.props.tags : [],
      suggestions: [
        { id: "First In", text: "First In" },
        { id: "Command", text: "Command" },
      ],
    };
    this.handleDecline = this.handleDecline.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleAdditionTag = this.handleAdditionTag.bind(this);
  }
  handleDeleteTag(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAdditionTag(tag) {
    this.setState((state) => ({ tags: [...state.tags, tag] }));
  }

  renderTagInput() {
    const { tags, suggestions } = this.state;
    if (!tags) {
      return null;
    }
    return (
      <ReactTags
        tags={tags}
        placeholder={"Add Tags"}
        suggestions={suggestions}
        handleDelete={this.handleDeleteTag}
        handleAddition={this.handleAdditionTag}
        minQueryLength={1}
        delimiters={delimiters}
      />
    );
  }

  handleConfirm() {
    this.props.onConfirm(this.state.tags);
  }

  handleDecline() {
    this.props.onDecline();
  }

  render() {
    return (
      <div style={styles}>
        <form className="confirmTag">
          <div>Title: {this.props.fileName}</div>
          <div>{this.renderTagInput()}</div>
          <div className="actions">
            <Button onClick={this.handleConfirm.bind(this)} bsStyle="primary">
              Save
            </Button>
            <Button onClick={this.handleDecline}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default ConfirmForm;
