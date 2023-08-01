import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getFoods, clear, getFoodDetails } from "../../../actions/foodActions";
import cow from "../../../images/Food/cow.png";
import almond from "../../../images/Food/almond.png";
import bread from "../../../images/Food/bread.png";
import condiment from "../../../images/Food/condiment.png";
import fungi from "../../../images/Food/fungi.png";
import legume from "../../../images/Food/legume.png";
import plant from "../../../images/Food/plant.png";
import junk from "../../../images/Food/junk.png";
import drink from "../../../images/Food/drink.png";
import "./FoodTypes.css";
import AddUserFood from "./AddUserFood";
import SearchFood from "./SearchFood";

class FoodTypes extends Component {
  state = {
    selectedFoodId: null,
    isOpen: false,
    isSearchOpen: false,
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    foodsByTypeList: PropTypes.array.isRequired,
    foodDetails: PropTypes.object,
    getFoods: PropTypes.func.isRequired,
    getFoodDetails: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.clear();
  }

  handleSelectFood = (foodId) => {
    this.setState({ selectedFoodId: foodId });
    this.props.getFoodDetails(foodId);
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
      <div className="foods">
        <div className="foodTypes">
          <button>
            <img
              alt="Food type"
              src={cow}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("AnimalProducts");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>AnimalProducts</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={almond}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("NutsSeeds");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>Nuts&Seeds</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={bread}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("GrainProducts");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>GrainProducts</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={condiment}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("Condiments");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>Condiments</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={fungi}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("Fungi");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>Fungi</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={legume}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("Vegetables");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>Vegetables</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={plant}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("PlantsFruits");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>Plants&Fruits</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={drink}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("Beverages");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>Beverages</span>
          </button>
          <button>
            <img
              alt="Food type"
              src={junk}
              width="70"
              height="70"
              onClick={(e) => {
                this.props.getFoods("ProcessedFoods");
                this.setState({ selectedFoodId: null });
                this.toggle();
              }}
            />
            <span>ProcessedFoods</span>
          </button>
        </div>

        {this.props.foodsByTypeList.length > 0 && this.state.isSearchOpen && (
          <SearchFood
            foodList={this.props.foodsByTypeList}
            onSelectFood={this.handleSelectFood}
            show={this.showModal}
          />
        )}
        <div className="foodDetails">
          {this.props.foodDetails && this.state.isOpen && (
            <AddUserFood
              item={this.props.foodDetails}
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
  foodsByTypeList: state.food.foodsByTypeList,
  foodDetails: state.food.foodDetails,
});

export default connect(mapStateToProps, { getFoods, getFoodDetails, clear })(
  FoodTypes
);
