import React from "react";
import { connect } from "react-redux";
import { ProgressBar, Button } from "react-bootstrap";
import { push } from "react-router-redux";
import { logoutUser } from "../actions/session-actions";
import { setCustomerLogOut } from "../actions/customer-actions";
import auth from "../auth/Authenticator";
import NavBar from "../components/common/NavBarComponent";
import ConfirmForm from "../components/form/ConfirmFormComponent";
import Modal from "../components/common/ModalComponent";

import * as customerAPI from "../api/CustomerAPI";
import * as hydrantAPI from "../api/HydrantAPI";
import * as userAPI from "../api/UserAPI";

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modal: { heading: null, body: null },
      msg: null,
    };
    this.logout = this.logout.bind(this);
    this.purgeHydrant = this.purgeHydrant.bind(this);
    this.deleteHydrantAll = this.deleteHydrantAll.bind(this);
    this.handleHydrantFormSubmissionSuccess =
      this.handleHydrantFormSubmissionSuccess.bind(this);
    this.handleHydrantFormSubmissionError =
      this.handleHydrantFormSubmissionError.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.showInitialLoading = this.showInitialLoading.bind(this);
    this.handleLoadingSuccess = this.handleLoadingSuccess.bind(this);
    this.handleLoadingError = this.handleLoadingError.bind(this);
    this.showModal = this.showModal.bind(this);
    this.falseModal = this.falseModal.bind(this);
  }

  componentDidMount() {
    if (!this.props.customer.customerid) {
      this.props.getCustomer(
        this.showInitialLoading,
        this.handleLoadingSuccess,
        this.handleLoadingError
      );
      this.props.getUser();
    }
  }

  showInitialLoading(msg, stepIndex, stepTotal) {
    let progressKnt = 100;
    let stepMsg = null;
    if (stepIndex > 0 && stepTotal > 0) {
      progressKnt = (stepIndex / stepTotal) * 100;
      if (progressKnt > 100) {
        progressKnt = 100;
      }
      stepMsg = `Step ${stepIndex}/${stepTotal}`;
    }
    let msgStr = "Loading In Progress";
    if (msg) {
      msgStr = msg;
    }
  }

  handleLoadingSuccess(message) {}

  handleLoadingError(msg) {
    let message = "Oops.. Something went wrong!!";
    if (msg) {
      message = msg;
    }
    const newState = Object.assign({}, this.state);
    newState.modal.body = (
      <div>
        <div> {message} </div>
        <div> Check your internet connection and refresh the browser </div>
        <div className="text-align-right margin-top-10px">
          <Button type="button" bsStyle="primary" onClick={this.toggleModal}>
            OK
          </Button>
        </div>
      </div>
    );
    this.setState(newState);
    this.showModal();
  }

  purgeHydrant(event) {
    event.preventDefault();
    this.setState({
      modal: {
        heading: "Delete All Hydrants",
        body: (
          <ConfirmForm
            body="This will delete all hydrants which are associated to customer account irrespective of the user with which it was created. Do you want to continue?"
            onConfirm={this.deleteHydrantAll}
            onDecline={this.toggleModal}
          />
        ),
      },
    });
    this.toggleModal();
  }

  deleteHydrantAll() {
    const newState = Object.assign({}, this.state);
    newState.modal.body = (
      <div>
        {<span> Deleting All Hydrants... </span>}
        <ProgressBar active now={100} />
      </div>
    );
    this.setState(newState);

    this.props.deleteAllHydrants(
      this.handleHydrantFormSubmissionSuccess,
      this.handleHydrantFormSubmissionError
    );
  }

  handleHydrantFormSubmissionSuccess() {
    this.toggleModal();
  }

  handleHydrantFormSubmissionError() {
    const newState = Object.assign({}, this.state);
    newState.modal.body = (
      <div>
        <span>
          {" "}
          Oops!Something went wrong in handleHydrantFormSubmissionError. Please
          try again.{" "}
        </span>
      </div>
    );
    this.setState(newState);
  }

  logout(event) {
    event.preventDefault();
    this.setState({
      modal: {
        heading: "Logout",
        body: (
          <ConfirmForm
            body="Are you sure you want to logout?"
            onConfirm={this.logoutUser}
            onDecline={this.toggleModal}
          />
        ),
      },
    });
    this.toggleModal();
  }

  logoutUser() {
    const customerConfig = this.props.customer.config;
    this.props.saveCustomerConfig({
      lastLat: customerConfig.lat,
      lastLon: customerConfig.lon,
      lastZoom: customerConfig.zoom,
      lastMapType: customerConfig.mapeType,
    });
    this.props.logoutUser();
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  falseModal() {
    this.setState({ showModal: false });
  }

  showModal() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div className="main-container">
        <NavBar logout={this.logout} purgeHydrant={this.purgeHydrant} />
        {this.props.children}
        <Modal
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}
          modal={this.state.modal}
        />
      </div>
    );
  }
}

const mapStateToProps = function (store) {
  return {
    customer: store.customer,
    user: store.user,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => {
      dispatch(push("/login"));
      dispatch(logoutUser());
      dispatch(setCustomerLogOut());
    },
    getCustomer: (showLoader, successCallback, errorCallback) =>
      customerAPI.getCustomerMini(
        dispatch,
        showLoader,
        successCallback,
        errorCallback
      ),
    getUser: () => userAPI.getUser(dispatch),
    saveCustomerConfig: (config) => customerAPI.saveConfig(dispatch, config),
    deleteAllHydrants: (successCallback, errorCallback) =>
      hydrantAPI.deleteAllHydrants(dispatch, successCallback, errorCallback),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
