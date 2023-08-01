import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changePassword } from "../../actions/userActions";
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

class ChangePassword extends Component {
  state = {
    email: "",
    oldPassword: "",
    newPassword: "",
    msgError: null,
  };

  static propTypes = {
    isEmailSent: PropTypes.bool,
    messageChange: PropTypes.string,
    error: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isEmailSent, messageChange } = this.props;
    if (error !== prevProps.error) {
      // Check for change password error
      if (error.id === "CHANGE_PASS_FAIL") {
        this.setState({ msgError: error.msg.message });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isEmailSent) {
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

    const { email, oldPassword, newPassword } = this.state;

    const changePass = { email, oldPassword, newPassword };

    // Attempt to change user's password
    this.props.changePassword(changePass);
    console.log("Parola schimbata ", changePass);

    this.setState({
      email: "",
      oldPassword: "",
      newPassword: "",
    });
  };

  render() {
    return (
      <Modal isOpen={this.props.show} toggle={this.toogle}>
        <ModalHeader toggle={this.toogle}>Change password</ModalHeader>
        <ModalBody>
          {this.state.msgError ? (
            <Alert color="danger">{this.state.msgError}</Alert>
          ) : null}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
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

              <Label for="oldPassword">Old Password</Label>
              <Input
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Old Password"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.oldPassword}
              />

              <Label for="newPassword">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="New Password"
                className="mb-3"
                onChange={this.handleChange}
                value={this.state.newPassword}
              />
              <Button
                color="dark"
                style={{ marginTop: "2rem" }}
                block
                type="submit"
              >
                Save changes
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  isEmailSent: state.user.isEmailSent,
  messageChange: state.user.message,
  error: state.error,
});

export default connect(mapStateToProps, { changePassword, clearErrors })(
  ChangePassword
);
