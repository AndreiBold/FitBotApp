import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getSupplements,
  clear,
  getSupplementDetails,
} from "../../../actions/supplementActions";
import vitamins from "../../../images/Supplements/vitamins.png";
import powders from "../../../images/Supplements/powders.png";
import "./SupplementTypes.css";
import AddUserSupplement from "./AddUserSupplement";
import SearchSupplement from "./SearchSupplement";

class SupplementTypes extends Component {
  state = {
    selectedSupplementId: null,
    isOpen: false,
    isSearchOpen: false,
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    supplementsByTypeList: PropTypes.array.isRequired,
    supplementDetails: PropTypes.object,
    getSupplements: PropTypes.func.isRequired,
    getSupplementDetails: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.clear();
  }

  handleSelectSupplement = (supplementId) => {
    this.setState({ selectedSupplementId: supplementId });
    this.props.getSupplementDetails(supplementId);
  };

  showModal = () => {
    this.setState({ isOpen: true });
  };

  hideModal = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
  };

  render() {
    return (
      <div className="supplements">
        <div className="supplementTypes">
          <button>
            <img
              alt="Supplement type"
              src={vitamins}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getSupplements("VitaminsMinerals");
                this.setState({ selectedSupplementId: null });
                this.toggle();
              }}
            />
            <span>Vitamins&Minerals</span>
          </button>
          <button>
            <img
              alt="Supplement type"
              src={powders}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getSupplements("Powders");
                this.setState({ selectedSupplementId: null });
                this.toggle();
              }}
            />
            <span>Powders</span>
          </button>
        </div>

        {this.props.supplementsByTypeList.length > 0 &&
          this.state.isSearchOpen && (
            <SearchSupplement
              supplementList={this.props.supplementsByTypeList}
              onSelectSupplement={this.handleSelectSupplement}
              show={this.showModal}
            />
          )}
        <div className="supplementDetails">
          {this.props.supplementDetails && this.state.isOpen && (
            <AddUserSupplement
              item={this.props.supplementDetails}
              show={true}
              toggleModal={this.hideModal}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  supplementsByTypeList: state.supplement.supplementsByTypeList,
  supplementDetails: state.supplement.supplementDetails,
});

export default connect(mapStateToProps, {
  getSupplements,
  getSupplementDetails,
  clear,
})(SupplementTypes);
