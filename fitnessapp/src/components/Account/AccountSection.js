import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AccountDetails from "./AccountDetails";
import FitnessDetails from "./FitnessDetails";
import CurrentObjective from "./CurrentObjective";
import ObjectivesHistory from "./ObjectivesHistory";

class AccountSection extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };
  render() {
    return this.props.isAuthenticated ? (
      <div>
        <AccountDetails />
        <FitnessDetails />
        <div className="row">
          <CurrentObjective className="col-xs-12 col-sm-12 col-md-8 col-lg-8" />
          <ObjectivesHistory className="col-xs-12 col-sm-12 col-md-4 col-lg-4" />
        </div>
      </div>
    ) : (
      <h3>Please login if you want to have access to your account details</h3>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, null)(AccountSection);
