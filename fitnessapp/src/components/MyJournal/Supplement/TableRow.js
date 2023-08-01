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
      noUnits: this.props.item.usersupplementData.noUnits,
      details: this.props.item.usersupplementData.details,
      isEditing: false,
      msgError: null,
    };

    this.calculateSupplementMacros = (macroPerUnit, noUnits) => {
      return macroPerUnit * noUnits + " grams";
    };

    this.calculateSupplementCalories = (caloriesPerUnit, noUnits) => {
      return caloriesPerUnit * noUnits;
    };

    this.getSupplementQuantity = (noUnits, measureUnit) => {
      return noUnits + " " + measureUnit;
    };

    this.edit = () => {
      this.setState({ isEditing: true });
    };

    this.cancel = () => {
      this.setState({
        isEditing: false,
        noUnits: this.props.item.usersupplementData.noUnits,
        details: this.props.item.usersupplementData.details,
      });
      this.props.clearErrors();
    };

    this.save = () => {
      const { noUnits, details } = this.state;
      const usersupplementItem = { noUnits, details };

      this.props.onSave(
        this.props.item.usersupplementData.supplementId,
        this.props.item.usersupplementData.dateTime,
        usersupplementItem
      );

      console.log("Salvat cu succes ", usersupplementItem);
    };

    this.delete = () => {
      this.props.onDelete(
        this.props.item.usersupplementData.supplementId,
        this.props.item.usersupplementData.dateTime
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
      // Check for update supplement error
      if (error.id === "SAVE_USER_SUPPLEMENT_FAIL") {
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
        <td>{this.props.item.supplementDetails.name}</td>
        <td>
          {this.getSupplementQuantity(
            this.props.item.usersupplementData.noUnits,
            this.props.item.supplementDetails.measureUnit
          )}
        </td>
        <td>
          {this.calculateSupplementCalories(
            this.props.item.supplementDetails.caloriesPerUnit,
            this.props.item.usersupplementData.noUnits
          )}
        </td>
        <td>
          {this.calculateSupplementMacros(
            this.props.item.supplementDetails.proteinPerUnit,
            this.props.item.usersupplementData.noUnits
          )}
        </td>
        <td>
          {this.calculateSupplementMacros(
            this.props.item.supplementDetails.carbsPerUnit,
            this.props.item.usersupplementData.noUnits
          )}
        </td>
        <td>
          {this.calculateSupplementMacros(
            this.props.item.supplementDetails.fatsPerUnit,
            this.props.item.usersupplementData.noUnits
          )}
        </td>
        <td>{this.props.item.usersupplementData.details}</td>
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
  isEdited: state.userxsupplement.isEdited,
});

export default connect(mapStateToProps, { clearErrors })(TableRow);
