import React from "react";
import * as util from "../../helpers/Util";

class SMSListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childProps: this.props.myProps,
    };
  }

  render() {
    const p = this.state.childProps;
    if (!p?.props.customer.customerId) {
      return null;
    }
    const partners = p.props.customer.partners;
    const smsList = [];
    for (let ii = 0; ii < this.props.smsList?.length; ii++) {
      if (this.props.smsList[ii].isOthers) {
        const flg = partners.indexOf(this.props.smsList[ii].customerID);
        if (flg >= 0) {
          smsList.push(this.props.smsList[ii]);
        }
      } else {
        smsList.push(this.props.smsList[ii]);
      }
    }
    return (
      <div className="sms-list-container section-container">
        <div className="section-content">
          {smsList.map((sms, index) => (
            <div key={index} className="section-row">
              <div className="sms-details">
                {sms.isOthers && (
                  <div style={{ backgroundColor: "#E0FFFF" }}>
                    {sms.type === "FIRE" && (
                      <span
                        className="glyphicon glyphicon-fire"
                        onClick={() => {
                          p.selectALocation(sms);
                        }}
                      >
                        {" "}
                        {sms.text}{" "}
                      </span>
                    )}
                    {sms.type === "AMBULANCE" && (
                      <span
                        className="glyphicon glyphicon-bed"
                        onClick={() => {
                          p.selectALocation(sms);
                        }}
                      >
                        {" "}
                        {sms.text}{" "}
                      </span>
                    )}
                    {sms.type !== "AMBULANCE" && sms.type !== "FIRE" && (
                      <span
                        className="glyphicon glyphicon-alert"
                        onClick={() => {
                          p.selectALocation(sms);
                        }}
                      >
                        {" "}
                        {sms.text}{" "}
                      </span>
                    )}
                  </div>
                )}
                {!sms.isOthers && (
                  <div>
                    {sms.type === "FIRE" && (
                      <span
                        className="glyphicon glyphicon-fire"
                        onClick={() => {
                          p.selectALocation(sms);
                        }}
                      >
                        {" "}
                        {sms.text}{" "}
                      </span>
                    )}
                    {sms.type === "AMBULANCE" && (
                      <span
                        className="glyphicon glyphicon-bed"
                        onClick={() => {
                          p.selectALocation(sms);
                        }}
                      >
                        {" "}
                        {sms.text}{" "}
                      </span>
                    )}
                    {sms.type !== "AMBULANCE" && sms.type !== "FIRE" && (
                      <span
                        className="glyphicon glyphicon-alert"
                        onClick={() => {
                          p.selectALocation(sms);
                        }}
                      >
                        {" "}
                        {sms.text}{" "}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {smsList.length === 0 && (
            <div className="section-row">No Messages.</div>
          )}
        </div>
      </div>
    );
  }
}

export default SMSListInfo;
