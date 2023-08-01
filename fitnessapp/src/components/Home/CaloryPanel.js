import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./CaloryPanel.css";

class CaloryPanel extends Component {
  static propTypes = {
    fitnessDetails: PropTypes.object.isRequired,
  };
  render() {
    return (
      <div className="caloric-container">
        <div className="panel panel-default limit">
          <div className="panel-heading">
            <h3 className="panel-title">Caloric Stats for Today</h3>
          </div>
          <div className="panel panel-default panel-body">
            <div>{this.props.fitnessDetails.totalDailyCalories} calories</div>
            <div>{this.props.fitnessDetails.protein} protein</div>
            <div>{this.props.fitnessDetails.carbs} carbs</div>
            <div>{this.props.fitnessDetails.fats} fats</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fitnessDetails: state.userxfood.fitnessDetails,
});

export default connect(mapStateToProps, null)(CaloryPanel);
