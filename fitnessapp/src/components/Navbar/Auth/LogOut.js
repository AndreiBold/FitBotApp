import React, { Component } from "react";
import { logout } from "../../../actions/userActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class LogOut extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <Link
          to="/"
          onClick={this.props.logout}
          className="nav-link text-white"
        >
          LogOut
        </Link>
      </div>
    );
  }
}

export default connect(null, { logout })(LogOut);
