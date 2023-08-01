import React, { Component } from "react";
import { Table, Button, Container } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getUserExercises,
  deleteUserExercise,
  saveUserExercise,
} from "../../../actions/userxexerciseActions";
import "./UserExerciseTable.css";
import {
  simpleFormatDate,
  // getLastWeekDates
  getLastWeekDatesPlusNameDays,
} from "../../../utils/utils";
import TableRow from "./TableRow";

class UserExerciseTable extends Component {
  state = {
    isOpen: false,
    selectedDate: simpleFormatDate(new Date()),
    search: "",
    dates: getLastWeekDatesPlusNameDays(),
  };

  static propTypes = {
    getUserExercises: PropTypes.func.isRequired,
    deleteUserExercise: PropTypes.func.isRequired,
    saveUserExercise: PropTypes.func.isRequired,
    userexerciseList: PropTypes.array.isRequired,
    userWeight: PropTypes.number.isRequired,
  };

  componentDidMount() {
    this.props.getUserExercises(this.state.selectedDate);
    console.log("DID MOUNT ", this.props.userexerciseList);
  }

  handleDelete = (exerciseId, dateTime) => {
    this.props.deleteUserExercise(exerciseId, dateTime);
  };

  handleSave = (exerciseId, dateTime, userexerciseItem) => {
    this.props.saveUserExercise(exerciseId, dateTime, userexerciseItem);
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleSelectDate = (date) => {
    this.setState({ selectedDate: date });
    this.props.getUserExercises(date);
  };

  updateSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  calculateExerciseCaloricBurn = (duration, metVal) => {
    let caloriesBurned =
      (duration * (metVal * 3.5 * this.props.userWeight)) / 200;
    return Math.round((caloriesBurned + Number.EPSILON) * 100) / 100;
  };

  render() {
    let groupedByWorkoutNr = {};
    let totalDayCalBurn = 0;
    this.props.userexerciseList.forEach((element) => {
      if (
        !groupedByWorkoutNr.hasOwnProperty(
          element.userexerciseData.workoutNumber
        )
      ) {
        groupedByWorkoutNr[element.userexerciseData.workoutNumber] = {};
        groupedByWorkoutNr[
          element.userexerciseData.workoutNumber
        ].exerciseItems = [];
        groupedByWorkoutNr[
          element.userexerciseData.workoutNumber
        ].totalCaloriesBurned = 0;
      }
      groupedByWorkoutNr[
        element.userexerciseData.workoutNumber
      ].exerciseItems.push(element);
      groupedByWorkoutNr[
        element.userexerciseData.workoutNumber
      ].totalCaloriesBurned += this.calculateExerciseCaloricBurn(
        element.userexerciseData.minutesDuration,
        element.exerciseDetails.metValue
      );
    });

    Object.keys(groupedByWorkoutNr).forEach((key) => {
      totalDayCalBurn += groupedByWorkoutNr[key].totalCaloriesBurned;
    });

    let filteredDates = [];
    filteredDates = this.state.dates.filter((date) => {
      return date.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    return (
      console.log("IN RENDER ", this.props.userexerciseList),
      (
        // console.log("OBIECT INTREG ", groupedByMealNr),
        // console.log("ARRAY CU DATE", this.state.dates),
        // (console.log(groupedByMealNr),

        <div>
          <Button
            color="info"
            size="lg"
            onClick={() => this.toggle()}
            style={{ width: "70px" }}
          >
            <i className="fa fa-calendar"></i>
          </Button>
          {this.state.isOpen && (
            <div className="container">
              <input
                className="search-bar"
                type="text"
                value={this.state.search}
                onChange={this.updateSearch}
              />
              <div className="datesList">
                {filteredDates.map((date, key) => {
                  return (
                    <div
                      style={{
                        color:
                          this.state.selectedDate === date.split(", ")[1]
                            ? "red"
                            : "",
                      }}
                      key={key}
                      onClick={() => this.handleSelectDate(date.split(", ")[1])}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="container date-container">
            {this.state.selectedDate}
          </div>
          <Container>
            Today you burned {totalDayCalBurn} calories from exercise
          </Container>
          {Object.keys(groupedByWorkoutNr).length === 0 ? (
            <h3>Your journal is empty in this day</h3>
          ) : (
            Object.keys(groupedByWorkoutNr).map((key) => {
              return (
                <div key={key}>
                  <h3 className="workout-nr">
                    Workout #
                    {key +
                      ": " +
                      groupedByWorkoutNr[key].totalCaloriesBurned +
                      " calories"}
                  </h3>
                  <Table key={key} size="sm" hover bordered>
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Duration minutes</th>
                        <th>Calories Burned</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByWorkoutNr[key].exerciseItems.map(
                        (item, index) => {
                          return (
                            <TableRow
                              key={index}
                              id={index}
                              item={item}
                              userWeight={this.props.userWeight}
                              onDelete={this.handleDelete}
                              onSave={this.handleSave}
                            />
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                </div>
              );
            })
          )}
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  userexerciseList: state.userxexercise.userexerciseList,
  userWeight: state.userxexercise.userWeight,
});

export default connect(mapStateToProps, {
  getUserExercises,
  deleteUserExercise,
  saveUserExercise,
})(UserExerciseTable);
