import React, { Component } from "react";
import Image from "next/image";

export default class ImageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
    return (
      <span
        className="imageContainer"
        onMouseEnter={(e) => this.setState({ hover: true })}
        onMouseLeave={(e) => this.setState({ hover: false })}
      >
        <div>
          <Image width={400} height={400} src={this.props.src} alt="Image" />
          <small>{this.props.pdfFileName}</small>
          <span
            onClick={this.props.onImageClick}
            style={{ visibility: this.state.hover ? "visible" : "hidden" }}
          >
            {!this.props.extremeleft &&
              (this.props.canEditImage || this.props.isPDF) &&
              !this.props.isFIO &&
              !this.props.isCommand &&
              this.props.isMine && (
                <i
                  onClick={(e) => {
                    this.props.onLeftClick();
                    e.stopPropagation();
                  }}
                  className="glyphicon glyphicon-arrow-left"
                />
              )}
            {this.props.reorder &&
              (this.props.canEditImage || this.props.isPDF) &&
              !this.props.isFIO &&
              !this.props.isCommand &&
              this.props.isMine && (
                <i
                  onClick={(e) => {
                    this.props.onOKClick();
                    e.stopPropagation();
                  }}
                  className="glyphicon glyphicon-ok"
                />
              )}
            {!this.props.extremeright &&
              (this.props.canEditImage || this.props.isPDF) &&
              !this.props.isFIO &&
              !this.props.isCommand &&
              this.props.isMine && (
                <i
                  onClick={(e) => {
                    this.props.onRightClick();
                    e.stopPropagation();
                  }}
                  className="glyphicon glyphicon-arrow-right"
                />
              )}
            {!this.props.reorder &&
              this.props.canEditImage &&
              !this.props.isFIO &&
              !this.props.isCommand &&
              this.props.isMine && (
                <i
                  onClick={(e) => {
                    this.props.onAnnotationClick();
                    e.stopPropagation();
                  }}
                  className="glyphicon glyphicon-pencil edit"
                />
              )}
            {!this.props.reorder &&
              (this.props.canEditImage || this.props.isPDF) &&
              !this.props.isFIO &&
              !this.props.isCommand &&
              this.props.isMine && (
                <i
                  onClick={(e) => {
                    this.props.onTaggingClick();
                    e.stopPropagation();
                  }}
                  className="glyphicon glyphicon-tag tag"
                />
              )}
            {!this.props.reorder &&
              (this.props.canEditImage || this.props.isPDF) &&
              !this.props.isFIO &&
              !this.props.isCommand &&
              this.props.isMine && (
                <i
                  onClick={(e) => {
                    this.props.onDeleteClick();
                    e.stopPropagation();
                  }}
                  className="glyphicon glyphicon-remove remove"
                />
              )}
          </span>
        </div>
      </span>
    );
  }
}
