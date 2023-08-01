import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getUserSupplements,
  deleteUserSupplement,
  saveUserSupplement,
} from "../../../actions/userxsupplementActions";
import "./UserSupplementTable.css";
import {
  simpleFormatDate,
  // getLastWeekDates
  getLastWeekDatesPlusNameDays,
} from "../../../utils/utils";
import TableRow from "./TableRow";
import DailyMacros from "./DailyMacros";

class UserSupplementTable extends Component {
  state = {
    isOpen: false,
    selectedDate: simpleFormatDate(new Date()),
    search: "",
    dates: getLastWeekDatesPlusNameDays(),
  };

  static propTypes = {
    getUserSupplements: PropTypes.func.isRequired,
    deleteUserSupplement: PropTypes.func.isRequired,
    saveUserSupplement: PropTypes.func.isRequired,
    usersupplementList: PropTypes.array.isRequired,
    fitnessDetails: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getUserSupplements(this.state.selectedDate);
    console.log("DID MOUNT ", this.props.usersupplementList);
  }

  handleDelete = (supplementId, dateTime) => {
    this.props.deleteUserSupplement(supplementId, dateTime);
  };

  handleSave = (supplementId, dateTime, usersupplementItem) => {
    this.props.saveUserSupplement(supplementId, dateTime, usersupplementItem);
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleSelectDate = (date) => {
    this.setState({ selectedDate: date });
    this.props.getUserSupplements(date);
  };

  updateSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  render() {
    let totalDayCal = 0;
    let totalDayProtein = 0;
    let totalDayCarbs = 0;
    let totalDayFats = 0;

    this.props.usersupplementList.forEach((element) => {
      totalDayCal +=
        element.supplementDetails.caloriesPerUnit *
        element.usersupplementData.noUnits;
      totalDayProtein +=
        element.supplementDetails.proteinPerUnit *
        element.usersupplementData.noUnits;
      totalDayCarbs +=
        element.supplementDetails.carbsPerUnit *
        element.usersupplementData.noUnits;
      totalDayFats +=
        element.supplementDetails.fatsPerUnit *
        element.usersupplementData.noUnits;
    });

    let filteredDates = [];
    filteredDates = this.state.dates.filter((date) => {
      return date.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    return (
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
        {this.props.usersupplementList.length === 0 ? (
          <h3>Your journal is empty in this day</h3>
        ) : (
          <Table size="sm" hover bordered>
            <thead>
              <tr>
                <th>Supplement</th>
                <th>Quantity</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {this.props.usersupplementList.map((item, index) => {
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
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  usersupplementList: state.userxsupplement.usersupplementList,
  fitnessDetails: state.userxsupplement.fitnessDetails,
});

export default connect(mapStateToProps, {
  getUserSupplements,
  deleteUserSupplement,
  saveUserSupplement,
})(UserSupplementTable);
