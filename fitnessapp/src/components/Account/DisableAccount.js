import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { disableUser } from "../../actions/userActions";
import { clearErrors } from "../../actions/errorActions";
import { Button, Modal, ModalHeader, ModalBody, Alert } from "reactstrap";

class DisableAccount extends Component {
  state = {
    msgError: null,
  };

  static propTypes = {
    isDisabled: PropTypes.bool,
    messageDisable: PropTypes.string,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isDisabled } = this.props;
    if (error !== prevProps.error) {
      // Check for disable account error
      if (error.id === "DISABLE_USER_FAIL") {
        this.setState({ msgError: error.msg.message });
      } else {
        this.setState({ msgError: null });
      }
    }

    if (isDisabled) {
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

  disable = (event) => {
    // Attempt to disable user's account
    this.props.disableUser();
    console.log("Pe data viitoare ");
  };

  render() {
    return (
      <Modal isOpen={this.props.show} toggle={this.toogle}>
        <ModalHeader toggle={this.toogle}>Disable account</ModalHeader>
        <ModalBody>
          {this.state.msgError ? (
            <Alert color="danger">{this.state.msgError}</Alert>
          ) : null}
          You are about to disable your account. Are you sure? You won't be able
          to login again, only if you mail our Fitbot team to reactivate your
          account
          <Button
            color="dark"
            style={{ marginTop: "2rem" }}
            block
            onClick={() => this.disable()}
          >
            Yes
          </Button>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  messageDisable: state.user.message,
  isDisabled: state.user.isDisabled,
  error: state.error,
});

export default connect(mapStateToProps, { disableUser, clearErrors })(
  DisableAccount
);
