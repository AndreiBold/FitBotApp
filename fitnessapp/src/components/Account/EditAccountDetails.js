import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateUser } from "../../actions/userActions";
import { clearErrors } from "../../actions/errorActions";
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

class EditAccountDetails extends Component {
  state = {
    firstName: this.props.userData.firstName,
    lastName: this.props.userData.lastName,
    email: this.props.userData.email,
    msgError: null,
  };

  static propTypes = {
    isEdited: PropTypes.bool,
    messageUpdate: PropTypes.string,
    error: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isEdited, messageUpdate } = this.props;
    if (error !== prevProps.error) {
      // Check for update user error
      if (error.id === "UPDATE_USER_FAIL") {
        this.setState({ msgError: error.msg.message });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isEdited) {
      this.toogle();
    }
  }

  toogle = () => {
    this.props.clearErrors();
    this.props.onClose();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { firstName, lastName, email } = this.state;

    const updatedUser = { firstName, lastName, email };

    // Attempt to update user's profile
    this.props.updateUser(updatedUser);
    console.log("Profil updatat ", updatedUser);
  };

  render() {
    return (
      <Modal isOpen={this.props.show} toggle={this.toogle}>
        <ModalHeader toggle={this.toogle}>Update Account info</ModalHeader>
        <ModalBody>
          {this.state.msgError ? (
            <Alert color="danger">{this.state.msgError}</Alert>
          ) : null}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.firstName}
              />

              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.lastName}
              />

              <Label for="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <Button
                color="dark"
                style={{ marginTop: "2rem" }}
                block
                type="submit"
              >
                Save info
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  isEdited: state.user.isEdited,
  messageUpdate: state.user.message,
  error: state.error,
});

export default connect(mapStateToProps, { updateUser, clearErrors })(
  EditAccountDetails
);
