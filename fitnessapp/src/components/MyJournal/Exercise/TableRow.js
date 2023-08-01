import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearErrors } from "../../../actions/errorActions";

class TableRow extends Component {
  static propTypes = {
    isEdited: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      minutesDuration: this.props.item.userexerciseData.minutesDuration,
      details: this.props.item.userexerciseData.details,
      workoutNumber: this.props.item.userexerciseData.workoutNumber,
      isEditing: false,
      msgError: null,
    };

    this.edit = () => {
      this.setState({ isEditing: true });
    };

    this.cancel = () => {
      this.setState({
        isEditing: false,
        minutesDuration: this.props.item.userexerciseData.minutesDuration,
        details: this.props.item.userexerciseData.details,
        workoutNumber: this.props.item.userexerciseData.workoutNumber,
      });
      this.props.clearErrors();
    };

    this.save = () => {
      const { workoutNumber, minutesDuration, details } = this.state;
      const userexerciseItem = { workoutNumber, minutesDuration, details };

      this.props.onSave(
        this.props.item.userexerciseData.exerciseId,
        this.props.item.userexerciseData.dateTime,
        userexerciseItem
      );

      console.log("Salvat cu succes ", userexerciseItem);
    };

    this.delete = () => {
      this.props.onDelete(
        this.props.item.userexerciseData.exerciseId,
        this.props.item.userexerciseData.dateTime
      );
    };

    this.handleChange = (evt) => {
      this.setState({
        [evt.target.name]: evt.target.value,
      });
    };

    this.handleSaveSuccess = () => {
      this.setState({ isEditing: false });
    };
  }

  componentDidUpdate(prevProps) {
    const { error, isEdited } = this.props;

    if (error !== prevProps.error) {
      // Check for update exercise error
      if (error.id === "SAVE_USER_EXERCISE_FAIL") {
        this.setState({
          msgError: error.msg.message,
        });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (this.state.isEditing) {
      if (isEdited) {
        this.handleSaveSuccess();
      }
    }
  }

  calculateExerciseCaloricBurn = (duration, metVal) => {
    let caloriesBurned =
      (duration * (metVal * 3.5 * this.props.userWeight)) / 200;
    return Math.round((caloriesBurned + Number.EPSILON) * 100) / 100;
  };

  render() {
    return this.state.isEditing ? (
      <tr>
        <td colSpan="7">
          <Form>
            <FormGroup>
              {this.state.msgError ? (
                <Alert color="danger">{this.state.msgError}</Alert>
              ) : null}
              <Label for="workoutNumber">Workout #</Label>
              <Input
                type="number"
                name="workoutNumber"
                id="workoutNumber"
                placeholder="Workout #"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.workoutNumber}
              />
              <Label for="minutesDuration">Duration minutes</Label>
              <Input
                type="number"
                name="minutesDuration"
                id="minutesDuration"
                placeholder="Duration minutes"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.minutesDuration}
              />
              <Label for="details">Details</Label>
              <Input
                type="text"
                name="details"
                id="details"
                placeholder="Details"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.details}
              />
            </FormGroup>
          </Form>
        </td>
        <td>
          <Button
            color="secondary"
            size="sm"
            className="btn-cancel"
            onClick={() => this.cancel()}
          >
            <i className="fa fa-arrow-left"></i>
          </Button>
          <Button color="success" size="sm" onClick={() => this.save()}>
            <i className="fa fa-save"></i>
          </Button>
        </td>
      </tr>
    ) : (
      <tr>
        <td>{this.props.item.exerciseDetails.name}</td>
        <td>{this.props.item.userexerciseData.minutesDuration}</td>
        <td>
          {this.calculateExerciseCaloricBurn(
            this.props.item.exerciseDetails.metValue,
            this.props.item.userexerciseData.minutesDuration
          )}
        </td>
        <td>{this.props.item.userexerciseData.details}</td>
        <td>
          <Button
            color="info"
            size="sm"
            className="btn-edit"
            onClick={() => this.edit()}
          >
            <i className="fa fa-edit"></i>
          </Button>
          <Button color="danger" size="sm" onClick={() => this.delete()}>
            &times;
          </Button>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  isEdited: state.userxexercise.isEdited,
});

export default connect(mapStateToProps, { clearErrors })(TableRow);
