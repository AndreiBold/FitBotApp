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
      noUnits: this.props.item.userfoodData.noUnits,
      details: this.props.item.userfoodData.details,
      mealNumber: this.props.item.userfoodData.mealNumber,
      isEditing: false,
      msgError: null,
    };

    this.calculateFoodMacros = (macroPerUnit, noUnits, measureUnit) => {
      return macroPerUnit * noUnits + " " + measureUnit;
    };

    this.calculateFoodCalories = (caloriesPerUnit, noUnits) => {
      return caloriesPerUnit * noUnits;
    };

    this.getFoodQuantity = (noUnits, measureUnit) => {
      return noUnits + " " + measureUnit;
    };

    this.edit = () => {
      this.setState({ isEditing: true });
    };

    this.cancel = () => {
      this.setState({
        isEditing: false,
        noUnits: this.props.item.userfoodData.noUnits,
        details: this.props.item.userfoodData.details,
        mealNumber: this.props.item.userfoodData.mealNumber,
      });
      this.props.clearErrors();
    };

    this.save = () => {
      const { mealNumber, noUnits, details } = this.state;
      const userfoodItem = { mealNumber, noUnits, details };

      this.props.onSave(
        this.props.item.userfoodData.foodId,
        this.props.item.userfoodData.dateTime,
        userfoodItem
      );
    };

    this.delete = () => {
      this.props.onDelete(
        this.props.item.userfoodData.foodId,
        this.props.item.userfoodData.dateTime
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
      // Check for update food error
      if (error.id === "SAVE_USER_FOOD_FAIL") {
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

  render() {
    return this.state.isEditing ? (
      <tr>
        <td colSpan="7">
          <Form>
            <FormGroup>
              {this.state.msgError ? (
                <Alert color="danger">{this.state.msgError}</Alert>
              ) : null}
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
        <td>{this.props.item.foodDetails.name}</td>
        <td>
          {this.getFoodQuantity(
            this.props.item.userfoodData.noUnits,
            this.props.item.foodDetails.measureUnit
          )}
        </td>
        <td>
          {this.calculateFoodCalories(
            this.props.item.foodDetails.caloriesPerUnit,
            this.props.item.userfoodData.noUnits
          )}
        </td>
        <td>
          {this.calculateFoodMacros(
            this.props.item.foodDetails.proteinPerUnit,
            this.props.item.userfoodData.noUnits,
            this.props.item.foodDetails.measureUnit
          )}
        </td>
        <td>
          {this.calculateFoodMacros(
            this.props.item.foodDetails.carbsPerUnit,
            this.props.item.userfoodData.noUnits,
            this.props.item.foodDetails.measureUnit
          )}
        </td>
        <td>
          {this.calculateFoodMacros(
            this.props.item.foodDetails.fatsPerUnit,
            this.props.item.userfoodData.noUnits,
            this.props.item.foodDetails.measureUnit
          )}
        </td>
        <td>{this.props.item.userfoodData.details}</td>
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
  isEdited: state.userxfood.isEdited,
});

export default connect(mapStateToProps, { clearErrors })(TableRow);
