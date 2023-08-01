import React, { Component } from "react";
import { Card } from "reactstrap";

class FoodDetails extends Component {
  render() {
    const {
      name,
      type,
      measureUnit,
      caloriesPerUnit,
      proteinPerUnit,
      carbsPerUnit,
      fatsPerUnit,
    } = this.props.item;
    return (
      <Card>
        <div className="details">
          <div>
            Name: <span>{name}</span>
          </div>
          <div>
            Type: <span>{type}</span>
          </div>
          <div>
            MeasureUnit: <span>{measureUnit}</span>
          </div>
          <div>
            CaloriesPerUnit: <span>{caloriesPerUnit}</span>
          </div>
          <div>
            ProteinPerUnit: <span>{proteinPerUnit}</span>
          </div>
          <div>
            CarbsPerUnit: <span>{carbsPerUnit}</span>
          </div>
          <div>
            FatsPerUnit: <span>{fatsPerUnit}</span>
          </div>
        </div>
      </Card>
    );
  }
}

export default FoodDetails;
