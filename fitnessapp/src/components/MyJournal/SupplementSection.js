import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SupplementTypes from "./Supplement/SupplementTypes";
import UserSupplementTable from "./Supplement/UserSupplementTable";
import "./SupplementSection.css";

class SupplementSection extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  render() {
    return this.props.isAuthenticated ? (
      <div>
        <h3>Search for any Supplement and add it to your journal</h3>
        <div className="types">
          <SupplementTypes />
        </div>
        <hr />
        <div className="mySupplements">
          <UserSupplementTable />
        </div>
      </div>
    ) : (
      <h3>Please login if you want to have access to your journal</h3>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, null)(SupplementSection);
