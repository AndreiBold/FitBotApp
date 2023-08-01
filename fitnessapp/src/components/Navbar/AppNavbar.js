import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Register from "./Auth/Register";
import LogIn from "./Auth/LogIn";
import LogOut from "./Auth/LogOut";
import "./AppNavbar.css";
import jarvislogo from "../../images/Home/jarvislogo.png";

class AppNavbar extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { isAuthenticated, userData } = this.props.user;

    const authLinks = (
      <Fragment>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item mr-3">
            <Link to="/" className="nav-link text-white">
              Home
            </Link>
          </li>
          <li className="nav-item dropdown mr-3">
            <Link
              to="/myjournal"
              className="nav-link dropdown-toggle active"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              My Journal
            </Link>

            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link to="/myjournal/foods" className="dropdown-item">
                Foods
              </Link>
              <Link to="/myjournal/exercises" className=" dropdown-item">
                Exercises
              </Link>
              <Link to="/myjournal/supplements" className="dropdown-item">
                Supplements
              </Link>
            </div>
          </li>
          <li className="nav-item mr-3">
            <Link to="/talktojarvis" className="nav-link text-white">
              TalkToJarvis
            </Link>
          </li>
          <li className="nav-item mr-3">
            <Link to="/progress" className="nav-link text-white">
              Progress
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <span className="navbar-text mr-3">
            <strong>
              {isAuthenticated && userData
                ? `Welcome ${userData.firstName} ${userData.lastName}!`
                : ""}
            </strong>
          </span>
          <li className="nav-item mr-3">
            <Link to="/account" className="nav-link text-white">
              Account
            </Link>
          </li>
          <li className="nav-item mr-3">
            <LogOut />
          </li>
        </ul>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item mr-3">
            <Link to="/" className="nav-link text-white">
              Home
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-3">
            <Register />
          </li>
          <li className="nav-item mr-3">
            <LogIn />
          </li>
        </ul>
      </Fragment>
    );

    return (
      <nav className="navbar navbar-expand-md navbar-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-brand">
          <img alt="App brand" src={jarvislogo} width="50px" height="50px" />
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(AppNavbar);
