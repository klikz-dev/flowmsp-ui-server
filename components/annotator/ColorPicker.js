import React from 'react';
import reactCSS from 'reactcss';
import { CompactPicker } from 'react-color';
import { Button } from 'react-bootstrap';

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: this.props.color
  };

  handleClick = e => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
      x: e.pageX
    });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({ color: color.rgb, displayColorPicker: false });
    this.props.onChange(color.hex);
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${
            this.state.color.b
          }, ${this.state.color.a})`
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '20',
          left: this.state.x
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });

    return (
      <span>
        <Button disabled={this.props.disabled} onClick={this.handleClick}>
          Color ⏷
        </Button>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <CompactPicker
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </span>
    );
  }
}

export default ColorPicker;
