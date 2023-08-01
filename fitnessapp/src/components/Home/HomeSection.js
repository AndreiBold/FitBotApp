import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Slider from "./Slider";
import Facts from "./Facts";
import CaloryPanel from "./CaloryPanel";

class HomeSection extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };
  render() {
    return this.props.isAuthenticated ? (
      <div style={{ margin: "50px" }}>
        <CaloryPanel />
        <Slider />
        <br></br>
        <br></br>
        <Facts />
      </div>
    ) : (
      <div style={{ margin: "50px" }}>
        <Slider />
        <br></br>
        <br></br>
        <Facts />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, null)(HomeSection);
