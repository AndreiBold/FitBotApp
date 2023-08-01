import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadUser } from "../../actions/userActions";
import { Card, Button } from "reactstrap";
import EditAccountDetails from "./EditAccountDetails";
import ChangePassword from "./ChangePassword";
import DisableAccount from "./DisableAccount";
import me from "../../images/Account/eu.png";

class AccountDetails extends Component {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
  };

  state = {
    isEditing: false,
    isChangingPass: false,
    isDisabling: false,
  };

  componentDidMount() {
    this.props.loadUser();
    console.log(this.props.userData);
  }

  showEditModal = () => {
    this.setState({ isEditing: true });
  };

  hideEditModal = () => {
    this.setState({ isEditing: false });
  };

  showChangePassModal = () => {
    this.setState({ isChangingPass: true });
  };

  hideChangePassModal = () => {
    this.setState({ isChangingPass: false });
  };

  showDisableAccountModal = () => {
    this.setState({ isDisabling: true });
  };

  hideDisableAccountModal = () => {
    this.setState({ isDisabling: false });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      isActive,
      birthDate,
      gender,
    } = this.props.userData;
    return (
      <Card
        style={{
          width: "1000px",
          marginLeft: "400px",
          marginTop: "100px",
          background: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Button
          color="info"
          size="sm"
          style={{ width: "35px", height: "35px", marginLeft: "950px" }}
          onClick={() => this.showEditModal()}
        >
          <i className="fa fa-edit"></i>
        </Button>
        <h3>Account info</h3>
        <div>
          First Name: <span>{firstName ? firstName : "-"}</span>
        </div>
        <div>
          Last Name: <span>{lastName ? lastName : "-"}</span>
        </div>
        <div>
          Email Address: <span>{email ? email : "-"}</span>
        </div>
        <div>
          Account Status:{" "}
          <span>
            {isActive ? (
              isActive === true ? (
                <span>Active</span>
              ) : (
                <span>Disabled</span>
              )
            ) : (
              <span>-</span>
            )}
          </span>
        </div>
        <div>
          Birth Date: <span>{birthDate ? birthDate : "-"}</span>
        </div>
        <div>
          Gender: <span>{gender ? gender : "-"}</span>
        </div>
        <img
          alt="me"
          src={me}
          style={{
            width: "150px",
            height: "150px",
            marginLeft: "750px",
            marginTop: "-100px",
          }}
        />
        <Button
          color="info"
          size="sm"
          style={{
            width: "80px",
            height: "50px",
            marginLeft: "40px",
            marginTop: "-60px",
            marginBottom: "50px",
          }}
          onClick={() => this.showChangePassModal()}
        >
          Change Password
        </Button>
        <Button
          color="danger"
          size="sm"
          style={{
            width: "80px",
            height: "50px",
            marginLeft: "170px",
            marginTop: "-100px",
            marginBottom: "10px",
          }}
          onClick={() => this.showDisableAccountModal()}
        >
          Disable Account
        </Button>
        {this.state.isEditing && (
          <EditAccountDetails
            show={true}
            onClose={this.hideEditModal}
            userData={this.props.userData}
          />
        )}
        {this.state.isChangingPass && (
          <ChangePassword show={true} onClose={this.hideChangePassModal} />
        )}
        {this.state.isDisabling && (
          <DisableAccount show={true} onClose={this.hideDisableAccountModal} />
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps, { loadUser })(AccountDetails);
