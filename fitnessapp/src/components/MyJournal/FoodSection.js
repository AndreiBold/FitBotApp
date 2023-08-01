import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FoodTypes from "./Food/FoodTypes";
import UserFoodTable from "./Food/UserFoodTable";
import "./FoodSection.css";

class FoodSection extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  render() {
    return this.props.isAuthenticated ? (
      <div>
        <h3>Search for any food and add it to your journal</h3>
        <div className="types">
          <FoodTypes />
        </div>
        <hr />
        <div className="myFoods">
          <UserFoodTable />
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

export default connect(mapStateToProps, null)(FoodSection);
