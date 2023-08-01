import React, { Component } from "react";
import { ListGroupItem } from "reactstrap";
import { Rating } from "primereact/rating";
import "./ObjectiveDetails.css";

class ObjectiveDetails extends Component {
  getProgressStar = (progressPercent) => {
    if (parseFloat(progressPercent) <= 15.0) return 0;
    if (
      parseFloat(progressPercent) > 15.0 &&
      parseFloat(progressPercent) <= 30.0
    )
      return 1;
    if (
      parseFloat(progressPercent) > 30.0 &&
      parseFloat(progressPercent) <= 47.0
    )
      return 2;
    if (
      parseFloat(progressPercent) > 47.0 &&
      parseFloat(progressPercent) <= 64.0
    )
      return 3;
    if (
      parseFloat(progressPercent) > 64.0 &&
      parseFloat(progressPercent) <= 81.0
    )
      return 4;
    if (parseFloat(progressPercent) > 81.0) return 5;
  };

  render() {
    return (
      <ListGroupItem
        style={{
          background: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <span className="goal">
          Goal: {this.props.item.objectiveDetails.name}
        </span>
        <span className="start">
          Start: {this.props.item.userobjectiveData.dateStart}
        </span>
        <span className="ml-5">
          End: {this.props.item.userobjectiveData.dateStop}
        </span>
        <span className="ml-5">
          Progress: {this.props.item.userobjectiveData.progressPercent}%
        </span>
        <span className="ml-5">
          Award:
          <Rating
            style={{ marginLeft: "800px", marginTop: "-25px" }}
            value={this.getProgressStar(
              this.props.item.userobjectiveData.progressPercent
            )}
            stars={5}
            className="mr-10"
          />
        </span>
      </ListGroupItem>
    );
  }
}

export default ObjectiveDetails;
