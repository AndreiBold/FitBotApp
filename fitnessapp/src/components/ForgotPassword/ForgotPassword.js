import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { forgotPassword } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "./ForgotPassword.css";

class ForgotPassword extends Component {
  state = {
    email: "",
    securityAnswer: "",
    msgError: null,
    msgSuccess: null,
    showAlert: true,
  };

  static propTypes = {
    isEmailSent: PropTypes.bool,
    messageForgotPass: PropTypes.string,
    error: PropTypes.object.isRequired,
    forgotPassword: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isEmailSent, messageForgotPass } = this.props;
    if (error !== prevProps.error) {
      // Check for forgot pass error
      if (error.id === "FORGOT_PASS_FAIL") {
        this.setState({ msgError: error.msg.message });
        this.drawAlert();
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isEmailSent !== prevProps.isEmailSent) {
      if (isEmailSent) {
        this.setState({ msgSuccess: messageForgotPass });
      } else {
        this.setState({ msgSuccess: null });
      }
    }
  }

  drawAlert = () => {
    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { email, securityAnswer } = this.state;

    const userInfo = {
      email,
      securityAnswer,
    };

    // Attempt to send email
    this.props.forgotPassword(userInfo);

    this.setState({
      email: "",
      securityAnswer: "",
    });
  };

  render() {
    return (
      <div>
        <h3>Forgot your password? No worries.</h3>
        {this.state.msgError && this.state.showAlert ? (
          <Alert color="danger">{this.state.msgError}</Alert>
        ) : null}
        {this.state.msgSuccess ? (
          <Alert color="success">{this.state.msgSuccess}</Alert>
        ) : null}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup className="form-forgot">
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="mb-3"
              onChange={this.handleChange}
              value={this.state.email}
            />

            <Label for="securityAnswer">Security Answer</Label>
            <Input
              type="text"
              name="securityAnswer"
              id="securityAnswer"
              placeholder="Where where you born?"
              className="mb-3"
              onChange={this.handleChange}
              value={this.state.securityAnswer}
            />
            <span
              className="rememberText"
              onClick={(e) => {
                this.props.history.push("/");
              }}
            >
              I remember my password
            </span>

            <Button
              color="dark"
              style={{ marginTop: "2rem" }}
              block
              type="submit"
            >
              Send Recovery Email
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isEmailSent: state.user.isEmailSent,
  messageForgotPass: state.user.message,
  error: state.error,
});

export default connect(mapStateToProps, { forgotPassword })(
  withRouter(ForgotPassword)
);
