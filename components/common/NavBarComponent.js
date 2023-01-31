import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Dropdown,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
} from "react-bootstrap";
import * as customerAPI from "../../api/CustomerAPI";
import Image from "next/image";

class NavBarComponent extends React.Component {
  render() {
    const inlStyle = [
      {
        verticalAlign: "middle",
        position: "absolute",
        top: "15px",
        right: "70px",
      },
      {
        marginRight: "10px",
      },
      {
        marginLeft: "5px",
        padding: "3px 7px",
        background: "#fff",
        color: "#337ab7",
      },
      {
        padding: "5px",
      },
      {
        textAlign: "left",
      },
    ];

    function showAccountInfo(customer) {
      if (customer && customer.links) {
        const links = customer.links;
        for (let i = 0; i < links.length; i++) {
          const link = customer.links[i];
          if (link && link.rel === "customerUpdate") {
            return true;
          }
        }
      }
      return false;
    }

    function showManageCustomer(customer) {
      if (
        customer &&
        customer.licence &&
        customer.licence.licenseType === "Master"
      ) {
        return true;
      }
      return false;
    }

    const locationFilterApplied = this.props.customer.locationFilterApplied;
    const locationFilterItem = locationFilterApplied
      ? locationFilterApplied.map((listItem, index) => (
          <li key={index} style={inlStyle[4]}>
            {listItem}
          </li>
        ))
      : "";
    const prePlanIndexStr =
      this.props.customer.locationKounter &&
      this.props.customer.locationKounter > 0
        ? `${this.props.customer.locationKounter}/${this.props.customer.locations.length}`
        : `${this.props.customer.locations.length}`;

    const tooltip = (
      <Tooltip id="tooltip">{<ul>{locationFilterItem}</ul>}</Tooltip>
    );

    return (
      <Navbar fixedTop>
        <Row>
          <Col xs={6}>
            <Col xs={6}>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">
                    <Image
                      width={320}
                      height={85}
                      src="/images/flow-msp.png"
                      alt="FlowMSP"
                    />
                  </Link>
                </Navbar.Brand>
              </Navbar.Header>
            </Col>
            <Col style={inlStyle[3]} xs={6}>
              {locationFilterApplied && locationFilterApplied.length > 0 && (
                <span>
                  <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <Button bsStyle="info">Filter On</Button>
                  </OverlayTrigger>
                </span>
              )}
            </Col>
          </Col>
          <Col xs={6}>
            <div style={inlStyle[0]}>
              {this.props.customer.locationsFetched && (
                <span style={inlStyle[1]} className="label label-primary">
                  Pre-plans
                  <span style={inlStyle[2]} className="badge">
                    {prePlanIndexStr}
                  </span>
                </span>
              )}
              {this.props.customer.hydrantsFetched && (
                <span style={inlStyle[1]} className="label label-primary">
                  No. of Hydrants
                  <span style={inlStyle[2]} className="badge">
                    {this.props.customer.hydrants.length}
                  </span>
                </span>
              )}
            </div>
            <Nav>
              <NavDropdown
                eventKey={3}
                title={
                  <span>
                    <i className="glyphicon glyphicon-cog" />
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/my-profile">
                  <Dropdown.Item eventKey={3.1}>
                    <i className="glyphicon glyphicon-user" />
                    My Profile
                  </Dropdown.Item>
                </LinkContainer>
                {showAccountInfo(this.props.customer) && (
                  <LinkContainer to="/account-info">
                    <Dropdown.Item eventKey={3.2}>
                      <i className="glyphicon glyphicon-briefcase" />
                      Account Information
                    </Dropdown.Item>
                  </LinkContainer>
                )}

                {showManageCustomer(this.props.customer) &&
                  this.props.user.role !== "USER" && (
                    <LinkContainer to="/admin-panel">
                      <Dropdown.Item eventKey={3.3}>
                        <i className="glyphicon glyphicon-equalizer" />
                        Admin Panel
                      </Dropdown.Item>
                    </LinkContainer>
                  )}

                {showManageCustomer(this.props.customer) &&
                  this.props.user.role !== "USER" && (
                    <LinkContainer to="/manage-customer">
                      <Dropdown.Item eventKey={3.4}>
                        <i className="glyphicon glyphicon-th-large" />
                        Manage Customer
                      </Dropdown.Item>
                    </LinkContainer>
                  )}
                {this.props.user.role !== "USER" && (
                  <LinkContainer to="/report-panel">
                    <Dropdown.Item eventKey={3.5}>
                      <i className="glyphicon glyphicon-stats" />
                      Reports
                    </Dropdown.Item>
                  </LinkContainer>
                )}

                {this.props.user.role !== "USER" && (
                  <LinkContainer to="/data-sharing">
                    <Dropdown.Item eventKey={3.6}>
                      <i className="glyphicon glyphicon-transfer" />
                      Data Sharing
                    </Dropdown.Item>
                  </LinkContainer>
                )}
                {this.props.user.role !== "USER" && (
                  <LinkContainer to="/upload-data">
                    <Dropdown.Item eventKey={3.7}>
                      <i className="glyphicon glyphicon-cloud-upload" />
                      Upload Data
                    </Dropdown.Item>
                  </LinkContainer>
                )}
                {this.props.user.role !== "USER" && (
                  <Dropdown.Item
                    eventKey={3.8}
                    onClick={this.props.purgeHydrant}
                  >
                    <i className="glyphicon glyphicon-trash" />
                    Delete All Hydrants
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  href="http://www.flowmsp.com/videos/"
                  target="_blank"
                  eventKey={3.9}
                >
                  <i className="glyphicon glyphicon-new-window" />
                  How-To Videos
                </Dropdown.Item>
                <Dropdown.Item eventKey={3.1} onClick={this.props.logout}>
                  <i className="glyphicon glyphicon-log-out" />
                  Logout
                </Dropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
        </Row>
      </Navbar>
    );
  }
}

const mapDispatchToProps = function (dispatch) {
  return {};
};

const mapStateToProps = function (store) {
  return {
    customer: store.customer,
    user: store.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBarComponent);
