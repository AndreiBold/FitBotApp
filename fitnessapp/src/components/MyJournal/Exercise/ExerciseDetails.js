import React, { Component } from "react";
import { Card } from "reactstrap";

class ExerciseDetails extends Component {
  render() {
    const { name, type, metValue, targetMuscles } = this.props.item;
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
            MET Value: <span>{metValue}</span>
          </div>
          <div>
            Target Muscles: <span>{targetMuscles}</span>
          </div>
        </div>
      </Card>
    );
  }
}

export default ExerciseDetails;
