import React from "react";
import { Dropdown } from "react-bootstrap";

class ContextMenu extends React.Component {
  render() {
    const contextMenu =
      this.props.role === "ADMIN" || this.props.role === "PLANNER"
        ? this.props.contextMenu
        : null;
    const entity = contextMenu && contextMenu.entity;
    const style = {
      display: entity ? "block" : "none",
      position: "absolute",
      left: entity ? entity.x : 0,
      top: entity ? entity.y : 0,
    };
    return (
      <div style={style} className="context-menu-container">
        {contextMenu ? (
          // <Clearfix>
          <Dropdown>
            {contextMenu.items.map((menuItem, index) => (
              <Dropdown.Item
                key={index}
                onSelect={(e) =>
                  this.props.handleContextMenuItemSelect(menuItem, entity)
                }
              >
                {menuItem.label}
              </Dropdown.Item>
            ))}
          </Dropdown>
        ) : // </Clearfix>
        null}
      </div>
    );
  }
}

export default ContextMenu;
