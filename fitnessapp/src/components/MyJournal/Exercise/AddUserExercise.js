import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addUserExercise } from "../../../actions/userxexerciseActions";
import { clearErrors } from "../../../actions/errorActions";
import { formatDate } from "../../../utils/utils";
import ExerciseDetails from "./ExerciseDetails";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

class AddUserExercise extends Component {
  state = {
    workoutNumber: "",
    minutesDuration: "",
    details: "",
    dateTime: "",
    msgError: null,
    msgSuccess: null,
    showAlert: true,
  };

  static propTypes = {
    isAdded: PropTypes.bool,
    messageAddExercise: PropTypes.string,
    error: PropTypes.object.isRequired,
    addUserExercise: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps, prevState) {
    const { error, isAdded, messageAddExercise } = this.props;
    if (error !== prevProps.error) {
      // Check for add exercise error
      if (error.id === "ADD_USER_EXERCISE_FAIL") {
        this.setState({ msgError: error.msg.message });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isAdded) {
      this.toogle();
    }

    // if (messageAddFood !== prevProps.messageAddFood) {
    //   if (messageAddFood) {
    //     this.setState({ msgSuccess: messageAddFood });
    //     this.drawAlert();
    //     console.log("Adaugat cu success");
    //   } else {
    //     this.setState({ msgSuccess: null });
    //   }
    // }

    // // If added, close modal
    // if (this.state.msgSuccess !== prevState.msgSuccess) {
    //   if (this.state.msgSuccess) this.toogle();
    // }

    // if (isAdded !== prevProps.isAdded) {
    //   if (isAdded) {
    //     this.setState({ msgSuccess: messageAddFood });
    //     // this.drawAlert();
    //     console.log("Adaugat cu success");
    //   } else {
    //     this.setState({ msgSuccess: null });
    //   }
    // }

    // if (this.props.show) {
    //   if (isAdded) this.toogle();
    // }
  }

  toogle = () => {
    // Clear errors
    this.props.clearErrors();

    console.log("Closing the modal");

    this.props.toggleModal();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { workoutNumber, minutesDuration, details } = this.state;

    const eid = this.props.item.exerciseId;
    const dateTime = formatDate(new Date());

    const exercise = {
      eid,
      workoutNumber,
      minutesDuration,
      details,
      dateTime,
    };

    // Attempt to add exercise to journal
    this.props.addUserExercise(exercise);
    console.log("Exercitiu adaugat ", exercise);

    this.setState({
      workoutNumber: "",
      minutesDuration: "",
      details: "",
      dateTime: "",
    });

    // this.toogle();
  };

  // drawAlert = () => {
  //   console.log("Draw alert!");
  //   setTimeout(() => {
  //     this.setState({ showAlert: false });
  //     this.drawAlert = 0;
  //   }, 3000);
  // };

  // componentWillUnmount() {
  //   if (this.drawAlert) {
  //     clearTimeout(this.drawAlert);
  //     this.drawAlert = 0;
  //   }
  // }

  render() {
    return (
      console.log(this.state.msgError),
      (
        <div>
          {this.props.show === true && (
            <Modal isOpen={this.props.show} toggle={this.toogle}>
              <ModalHeader toggle={this.toogle}>
                <ExerciseDetails item={this.props.item} />
                Add exercise
              </ModalHeader>

              <ModalBody>
                {this.state.msgError ? (
                  <Alert color="danger">{this.state.msgError}</Alert>
                ) : null}
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
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

                    <Button
                      color="dark"
                      style={{ marginTop: "2rem" }}
                      block
                      type="submit"
                    >
                      Add Exercise
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
          )}
          {/* {this.state.msgSuccess && this.state.showAlert ? (
          <Alert color="success">{this.state.msgSuccess}</Alert>
        ) : null} */}
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  messageAddExercise: state.userxexercise.message,
  isAdded: state.userxexercise.isAdded,
  error: state.error,
});

export default connect(mapStateToProps, { addUserExercise, clearErrors })(
  AddUserExercise
);
