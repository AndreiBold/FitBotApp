import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getUserFoods,
  deleteUserFood,
  saveUserFood,
} from "../../../actions/userxfoodActions";
import "./UserFoodTable.css";
import {
  simpleFormatDate,
  // getLastWeekDates,
  getLastWeekDatesPlusNameDays,
} from "../../../utils/utils";
import TableRow from "./TableRow";
import DailyMacros from "./DailyMacros";

class UserFoodTable extends Component {
  state = {
    isOpen: false,
    selectedDate: simpleFormatDate(new Date()),
    search: "",
    dates: getLastWeekDatesPlusNameDays(),
  };

  static propTypes = {
    getUserFoods: PropTypes.func.isRequired,
    deleteUserFood: PropTypes.func.isRequired,
    saveUserFood: PropTypes.func.isRequired,
    userfoodList: PropTypes.array.isRequired,
    fitnessDetails: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getUserFoods(this.state.selectedDate);
    console.log("DID MOUNT ", this.props.userfoodList);
  }

  handleDelete = (foodId, dateTime) => {
    this.props.deleteUserFood(foodId, dateTime);
  };

  handleSave = (foodId, dateTime, userfoodItem) => {
    this.props.saveUserFood(foodId, dateTime, userfoodItem);
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleSelectDate = (date) => {
    this.setState({ selectedDate: date });
    this.props.getUserFoods(date);
  };

  updateSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  render() {
    let groupedByMealNr = {};
    let totalDayCal = 0;
    let totalDayProtein = 0;
    let totalDayCarbs = 0;
    let totalDayFats = 0;

    this.props.userfoodList.forEach((element) => {
      if (!groupedByMealNr.hasOwnProperty(element.userfoodData.mealNumber)) {
        groupedByMealNr[element.userfoodData.mealNumber] = {};
        groupedByMealNr[element.userfoodData.mealNumber].foodItems = [];
        groupedByMealNr[element.userfoodData.mealNumber].totalCalories = 0;
        groupedByMealNr[element.userfoodData.mealNumber].totalProtein = 0;
        groupedByMealNr[element.userfoodData.mealNumber].totalCarbs = 0;
        groupedByMealNr[element.userfoodData.mealNumber].totalFats = 0;
      }
      groupedByMealNr[element.userfoodData.mealNumber].foodItems.push(element);
      groupedByMealNr[element.userfoodData.mealNumber].totalCalories +=
        element.foodDetails.caloriesPerUnit * element.userfoodData.noUnits;
      groupedByMealNr[element.userfoodData.mealNumber].totalProtein +=
        element.foodDetails.proteinPerUnit * element.userfoodData.noUnits;
      groupedByMealNr[element.userfoodData.mealNumber].totalCarbs +=
        element.foodDetails.carbsPerUnit * element.userfoodData.noUnits;
      groupedByMealNr[element.userfoodData.mealNumber].totalFats +=
        element.foodDetails.fatsPerUnit * element.userfoodData.noUnits;
    });

    Object.keys(groupedByMealNr).forEach((key) => {
      totalDayCal += groupedByMealNr[key].totalCalories;
      totalDayProtein += groupedByMealNr[key].totalProtein;
      totalDayCarbs += groupedByMealNr[key].totalCarbs;
      totalDayFats += groupedByMealNr[key].totalFats;
    });

    let filteredDates = [];
    filteredDates = this.state.dates.filter((date) => {
      return date.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    return (
      console.log("IN RENDER ", this.props.userfoodList),
      // console.log("OBIECT INTREG ", groupedByMealNr),
      // console.log("ARRAY CU DATE", this.state.dates),
      (console.log(groupedByMealNr),
      (
        <div>
          <Button
            color="info"
            size="lg"
            onClick={() => this.toggle()}
            style={{ width: "70px" }}
          >
            <i className="fa fa-calendar"></i>
          </Button>
          {this.state.isOpen && (
            <div className="container">
              <input
                className="search-bar"
                type="text"
                value={this.state.search}
                onChange={this.updateSearch}
              />
              <div className="datesList">
                {filteredDates.map((date, key) => {
                  return (
                    <div
                      style={{
                        color:
                          this.state.selectedDate === date.split(", ")[1]
                            ? "red"
                            : "",
                      }}
                      key={key}
                      onClick={() => this.handleSelectDate(date.split(", ")[1])}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="container date-container">
            {this.state.selectedDate}
          </div>
          <DailyMacros
            fitnessDetails={this.props.fitnessDetails}
            totalDayCal={totalDayCal}
            totalDayProtein={totalDayProtein}
            totalDayCarbs={totalDayCarbs}
            totalDayFats={totalDayFats}
          />
          {Object.keys(groupedByMealNr).length === 0 ? (
            <h3>Your journal is empty in this day</h3>
          ) : (
            Object.keys(groupedByMealNr).map((key) => {
              return (
                <div key={key}>
                  <h3 className="meal-nr">
                    Meal #
                    {key +
                      ": " +
                      groupedByMealNr[key].totalCalories +
                      " calories"}
                  </h3>
                  <Table key={key} size="sm" hover bordered>
                    <thead>
                      <tr>
                        <th>Food</th>
                        <th>Quantity</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Carbs</th>
                        <th>Fats</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByMealNr[key].foodItems.map((item, index) => {
                        return (
                          <TableRow
                            key={index}
                            id={index}
                            item={item}
                            onDelete={this.handleDelete}
                            onSave={this.handleSave}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              );
            })
          )}
        </div>
      ))
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  userfoodList: state.userxfood.userfoodList,
  fitnessDetails: state.userxfood.fitnessDetails,
});

export default connect(mapStateToProps, {
  getUserFoods,
  deleteUserFood,
  saveUserFood,
})(UserFoodTable);
