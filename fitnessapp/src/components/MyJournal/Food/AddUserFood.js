import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addUserFood } from "../../../actions/userxfoodActions";
import { clearErrors } from "../../../actions/errorActions";
import { formatDate } from "../../../utils/utils";
import FoodDetails from "./FoodDetails";
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

class AddUserFood extends Component {
  state = {
    mealNumber: "",
    noUnits: "",
    details: "",
    dateTime: "",
    msgError: null,
    msgSuccess: null,
    showAlert: true,
  };

  static propTypes = {
    isAdded: PropTypes.bool,
    messageAddFood: PropTypes.string,
    error: PropTypes.object.isRequired,
    addUserFood: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps, prevState) {
    const { error, isAdded, messageAddFood } = this.props;
    if (error !== prevProps.error) {
      // Check for add food error
      if (error.id === "ADD_USER_FOOD_FAIL") {
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

    const { mealNumber, noUnits, details } = this.state;

    const fid = this.props.item.foodId;
    const dateTime = formatDate(new Date());

    const food = {
      fid,
      mealNumber,
      noUnits,
      details,
      dateTime,
    };

    // Attempt to add food to journal
    this.props.addUserFood(food);

    this.setState({
      mealNumber: "",
      noUnits: "",
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
      <div>
        {this.props.show === true && (
          <Modal isOpen={this.props.show} toggle={this.toogle}>
            <ModalHeader toggle={this.toogle}>
              <FoodDetails item={this.props.item} />
              Add food
            </ModalHeader>

            <ModalBody>
              {this.state.msgError ? (
                <Alert color="danger">{this.state.msgError}</Alert>
              ) : null}
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="mealNumber">Meal #</Label>
                  <Input
                    type="number"
                    name="mealNumber"
                    id="mealNumber"
                    placeholder="Meal #"
                    className="mb-3"
                    onChange={this.handleChange}
                    value={this.state.mealNumber}
                  />

                  <Label for="noUnits">Quantity</Label>
                  <Input
                    type="number"
                    name="noUnits"
                    id="noUnits"
                    placeholder="Quantity"
                    className="mb-3"
                    onChange={this.handleChange}
                    value={this.state.noUnits}
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
                    Add Food
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
    );
  }
}

const mapStateToProps = (state) => ({
  messageAddFood: state.userxfood.message,
  isAdded: state.userxfood.isAdded,
  error: state.error,
});

export default connect(mapStateToProps, { addUserFood, clearErrors })(
  AddUserFood
);
