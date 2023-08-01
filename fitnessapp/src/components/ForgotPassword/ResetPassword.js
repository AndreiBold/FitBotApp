import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { resetPassword } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "./ResetPassword.css";

class ResetPassword extends Component {
  state = {
    newPassword: "",
    confirmPassword: "",
    msgError: null,
    msgSuccess: null,
    showAlert: true,
  };

  static propTypes = {
    isEmailSent: PropTypes.bool,
    messageResetPass: PropTypes.string,
    token: PropTypes.string.isRequired,
    error: PropTypes.object.isRequired,
    forgotPassword: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isEmailSent, messageResetPass } = this.props;
    if (error !== prevProps.error) {
      // Check for forgot pass error
      if (error.id === "RESET_PASS_FAIL") {
        this.setState({ msgError: error.msg.message });
        this.drawAlert();
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isEmailSent !== prevProps.isEmailSent) {
      if (isEmailSent) {
        this.setState({ msgSuccess: messageResetPass });
        this.loginRedirect();
      } else {
        this.setState({ msgSuccess: null });
      }
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { newPassword, confirmPassword } = this.state;
    const token = this.props.match.params.token;

    const userInfo = {
      newPassword,
      confirmPassword,
      token,
    };

    // Attempt to reset password
    this.props.resetPassword(userInfo);

    this.setState({
      newPassword: "",
      confirmPassword: "",
    });
  };

  drawAlert = () => {
    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  };

  loginRedirect = () => {
    setTimeout(() => {
      this.props.history.push("/");
    }, 4000);
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <h3>We are almost done. Just set your new password.</h3>
        {this.state.msgError && this.state.showAlert ? (
          <Alert color="danger">{this.state.msgError}</Alert>
        ) : null}
        {this.state.msgSuccess ? (
          <Alert color="success">{this.state.msgSuccess}</Alert>
        ) : null}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup className="form-reset">
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

            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Where where you born?"
              className="mb-3"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
            />

            <Button
              color="dark"
              style={{ marginTop: "2rem" }}
              block
              type="submit"
            >
              Save password
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isEmailSent: state.user.isEmailSent,
  messageResetPass: state.user.message,
  error: state.error,
});

export default connect(mapStateToProps, { resetPassword })(
  withRouter(ResetPassword)
);
