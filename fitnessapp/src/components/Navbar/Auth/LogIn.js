import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
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
import "./LogIn.css";

class LogIn extends Component {
  state = {
    modal: false,
    email: "",
    password: "",
    msgError: null,
    msgSuccess: null,
    showAlert: true,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    history: PropTypes.object.isRequired,
    messageLogin: PropTypes.string,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated, messageLogin } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msgError: error.msg.message });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isAuthenticated !== prevProps.isAuthenticated) {
      if (isAuthenticated) {
        this.setState({ msgSuccess: messageLogin });
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

    const { email, password } = this.state;

    const user = {
      email,
      password,
    };

    // Attempt to login
    this.props.login(user);

    this.setState({
      email: "",
      password: "",
    });
  };

  // drawAlert = () => {
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
        <Link to="/login" onClick={this.toogle} className="nav-link text-white">
          LogIn
        </Link>
        <Modal isOpen={this.state.modal} toggle={this.toogle}>
          <ModalHeader toggle={this.toogle}>LogIn</ModalHeader>
          <ModalBody>
            {this.state.msgError ? (
              <Alert color="danger">{this.state.msgError}</Alert>
            ) : null}
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
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
                <span
                  className="forgotText"
                  onClick={(e) => {
                    this.toogle();
                    this.props.history.push("/forgot-password");
                    this.setState({
                      email: "",
                      password: "",
                    });
                  }}
                >
                  I forgot my password
                </span>

                <Button
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                  type="submit"
                >
                  Login
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
  messageLogin: state.user.message,
  error: state.error,
});

export default withRouter(
  connect(mapStateToProps, { login, clearErrors })(LogIn)
);
