import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getExercises,
  clear,
  getExerciseDetails,
} from "../../../actions/exerciseActions";
import aerobic from "../../../images/Exercises/aerobic.png";
import balance from "../../../images/Exercises/balance.jpg";
import flexibility from "../../../images/Exercises/flexibility.png";
import strength from "../../../images/Exercises/strength.png";
import "./ExerciseTypes.css";
import AddUserExercise from "./AddUserExercise";
import SearchExercise from "./SearchExercise";

class ExerciseTypes extends Component {
  state = {
    selectedExerciseId: null,
    isOpen: false,
    isSearchOpen: false,
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    exercisesByTypeList: PropTypes.array.isRequired,
    exerciseDetails: PropTypes.object,
    getExercises: PropTypes.func.isRequired,
    getExerciseDetails: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.clear();
  }

  handleSelectExercise = (exerciseId) => {
    this.setState({ selectedExerciseId: exerciseId });
    this.props.getExerciseDetails(exerciseId);
  };

  showModal = () => {
    this.setState({ isOpen: true });
  };

  hideModal = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
  };

  render() {
    return (
      <div className="exercises">
        <div className="exerciseTypes">
          <button>
            <img
              alt="Exercise type"
              src={aerobic}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getExercises("Endurance");
                this.setState({ selectedExerciseId: null });
                this.toggle();
              }}
            />
            <span>Endurance</span>
          </button>
          <button>
            <img
              alt="Exercise type"
              src={balance}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getExercises("Balance");
                this.setState({ selectedExerciseId: null });
                this.toggle();
              }}
            />
            <span>Balance</span>
          </button>
          <button>
            <img
              alt="Exercise type"
              src={flexibility}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getExercises("Flexibility");
                this.setState({ selectedExerciseId: null });
                this.toggle();
              }}
            />
            <span>Flexibility</span>
          </button>
          <button>
            <img
              alt="Exercise type"
              src={strength}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getExercises("Strength");
                this.setState({ selectedExerciseId: null });
                this.toggle();
              }}
            />
            <span>Strength</span>
          </button>
        </div>

        {this.props.exercisesByTypeList.length > 0 &&
          this.state.isSearchOpen && (
            <SearchExercise
              exerciseList={this.props.exercisesByTypeList}
              onSelectExercise={this.handleSelectExercise}
              show={this.showModal}
            />
          )}
        <div className="exerciseDetails">
          {this.props.exerciseDetails && this.state.isOpen && (
            <AddUserExercise
              item={this.props.exerciseDetails}
              show={true}
              toggleModal={this.hideModal}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  exercisesByTypeList: state.exercise.exercisesByTypeList,
  exerciseDetails: state.exercise.exerciseDetails,
});

export default connect(mapStateToProps, {
  getExercises,
  getExerciseDetails,
  clear,
})(ExerciseTypes);
