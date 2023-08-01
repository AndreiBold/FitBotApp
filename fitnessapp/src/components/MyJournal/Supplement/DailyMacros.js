import React, { Component } from "react";
import { Card } from "reactstrap";

class DailyMacros extends Component {
  render() {
    const {
      carbs,
      protein,
      fats,
      totalDailyCalories,
    } = this.props.fitnessDetails;
    return (
      <Card className="foodie">
        <h3>Macro nutrient stats</h3>
        <div>
          Protein:{" "}
          <span>
            {this.props.totalDayProtein}/{protein}
          </span>
        </div>
        <div>
          Carbs:{" "}
          <span>
            {this.props.totalDayCarbs}/{carbs}
          </span>
        </div>
        <div>
          Fats:{" "}
          <span>
            {this.props.totalDayFats}/{fats}
          </span>
        </div>
        <div>
          TotalCalories:{" "}
          <span>
            {this.props.totalDayCal}/{totalDailyCalories}
          </span>
        </div>
      </Card>
    );
  }
}

export default DailyMacros;
