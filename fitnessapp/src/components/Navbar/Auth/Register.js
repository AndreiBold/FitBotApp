import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { register } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";
import { Link } from "react-router-dom";
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

class Register extends Component {
  state = {
    modal: false,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityAnswer: "",
    birthDate: "",
    gender: "",
    msgError: null,
    msgSuccess: null,
    showAlert: true,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    history: PropTypes.object.isRequired,
    messageRegister: PropTypes.string,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated, messageRegister } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        this.setState({ msgError: error.msg.message });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isAuthenticated !== prevProps.isAuthenticated) {
      if (isAuthenticated) {
        this.setState({ msgSuccess: messageRegister });
        this.props.history.push("/");
        // this.drawAlert();
      } else {
        this.setState({ msgSuccess: null });
      }
    }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toogle();
      }
    }

    // if (this.drawAlert) {
    //   clearTimeout(this.drawAlert);
    //   this.drawAlert = 0;
    // }
  }

  toogle = () => {
    // Clear errors
    this.props.clearErrors();

    this.setState({
      modal: !this.state.modal,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      securityAnswer,
      birthDate,
      gender,
    } = this.state;

    // Create user object
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      securityAnswer,
      birthDate,
      gender,
    };

    // Attempt to register
    this.props.register(newUser);

    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      securityAnswer: "",
      birthDate: "",
      gender: "",
    });

    // this.drawAlert();
  };

  // drawAlert = () =>
  //   setTimeout(() => {
  //     this.setState({ showAlert: false });
  //     this.drawAlert = 0;
  //   }, 3000);

  // // componentWillUnmount() {
  // //   if (this.drawAlert) {
  // //     clearTimeout(this.drawAlert);
  // //     this.drawAlert = 0;
  // //   }
  // // }

  render() {
    return (
      <div>
        <Link
          to="/register"
          onClick={this.toogle}
          className="nav-link text-white"
        >
          Register
        </Link>
        <Modal isOpen={this.state.modal} toggle={this.toogle}>
          <ModalHeader toggle={this.toogle}>Register</ModalHeader>
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

                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.password}
                />

                <Label for="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.confirmPassword}
                />

                <Label for="birthDate">BirthDate</Label>
                <Input
                  type="text"
                  name="birthDate"
                  id="birthDate"
                  placeholder="BirthDate"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.birthDate}
                />

                <Label for="gender">Gender</Label>
                <Input
                  type="text"
                  name="gender"
                  id="gender"
                  placeholder="Gender"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.gender}
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
                <Button
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                  type="submit"
                >
                  Register
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
        {/* {this.state.msgSuccess && this.state.showAlert
          ? (console.log(this.state.showAlert),
            (<Alert color="success">{this.state.msgSuccess}</Alert>))
          : null} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  messageRegister: state.user.message,
  error: state.error,
});

export default withRouter(
  connect(mapStateToProps, { register, clearErrors })(Register)
);
