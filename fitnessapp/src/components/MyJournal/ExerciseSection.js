import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ExerciseTypes from "./Exercise/ExerciseTypes";
import UserExerciseTable from "./Exercise/UserExerciseTable";
import "./ExerciseSection.css";

class ExerciseSection extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  render() {
    return this.props.isAuthenticated ? (
      <div>
        <h3>Search for any exercise and add it to your journal</h3>
        <div className="types">
          <ExerciseTypes />
        </div>
        <hr />
        <div className="myExercises">
          <UserExerciseTable />
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

export default connect(mapStateToProps, null)(ExerciseSection);
