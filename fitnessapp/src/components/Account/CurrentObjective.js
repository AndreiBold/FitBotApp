import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentObjective } from "../../actions/userxobjectiveActions";
import { Card, Progress } from "reactstrap";

class CurrentObjective extends Component {
  static propTypes = {
    currentObjective: PropTypes.object,
    getCurrentObjective: PropTypes.func,
    objectiveName: PropTypes.string,
    userStartWeight: PropTypes.string,
    userCurrentWeight: PropTypes.string,
  };

  componentDidMount() {
    this.props.getCurrentObjective();
  }

  // calculateProgress = (startWeight, currentWeight, objWeight) => {
  //   if (startWeight && currentWeight && objWeight) {
  //     var startWeightExtracted = parseInt(
  //       startWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
  //     );
  //     var currentWeightExtracted = parseInt(
  //       currentWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
  //     );
  //     var objWeightExtracted = parseInt(
  //       objWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
  //     );

  //     var idealDiff = Math.abs(startWeightExtracted - objWeightExtracted);
  //     var actualDiff = Math.abs(currentWeightExtracted - objWeightExtracted);

  //     var progress = 100 - (100 * actualDiff) / idealDiff;

  //     return progress;
  //   } else return 0;
  // };

  calculateProgress = (
    startWeight,
    currentWeight,
    objWeight,
    objName,
    dateStart,
    dateStop
  ) => {
    if (startWeight && currentWeight && objWeight) {
      var startWeightExtracted = parseInt(
        startWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
      );
      var currentWeightExtracted = parseInt(
        currentWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
      );
      var objWeightExtracted = parseInt(
        objWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
      );
      if (
        (objName === "gain weight" &&
          currentWeightExtracted < startWeightExtracted) ||
        (objName === "lose weight" &&
          currentWeightExtracted > startWeightExtracted)
      )
        return 0;
      if (objName === "mantain weight") {
        var start = new Date(dateStart);
        var stop = new Date(dateStop);
        var crt = new Date();
        var startDiff = Math.round(
          (stop.getTime() - start.getTime()) / (1000 * 3600 * 24)
        );
        var crtDiff = Math.round(
          (stop.getTime() - crt.getTime()) / (1000 * 3600 * 24)
        );
        if (currentWeight !== startWeight) return 0;
        else return 100 - (100 * crtDiff) / startDiff;
      }

      var idealDiff = Math.abs(startWeightExtracted - objWeightExtracted);
      var actualDiff = Math.abs(currentWeightExtracted - objWeightExtracted);

      var progress = 100 - (100 * actualDiff) / idealDiff;

      return progress;
    } else return 0;
  };

  render() {
    return (
      // console.log(this.props.userStartWeight),
      // console.log(this.props.userCurrentWeight),
      // console.log(this.props.currentObjective.objectiveWeight),
      this.props.userStartWeight !== undefined &&
        this.props.userCurrentWeight !== undefined &&
        this.props.currentObjective !== undefined &&
        this.props.currentObjective.objectiveWeight !== undefined ? (
        <Card
          style={{
            width: "300px",
            marginLeft: "1300px",
            marginTop: "70px",
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <h3>Current objective</h3>
          <div>
            Name: <span>{this.props.objectiveName}</span>
          </div>
          <div>
            Date Start: <span>{this.props.currentObjective.dateStart}</span>
          </div>
          <div>
            Date Stop: <span>{this.props.currentObjective.dateStop}</span>
          </div>
          <div>
            Start Weight: <span>{this.props.userStartWeight}</span>
          </div>
          <div>
            Objective Weight:{" "}
            <span>{this.props.currentObjective.objectiveWeight}</span>
          </div>
          <div>
            Current Weight: <span>{this.props.userCurrentWeight}</span>
          </div>
          <div>
            Progress:{" "}
            <span>
              {this.calculateProgress(
                this.props.userStartWeight,
                this.props.userCurrentWeight,
                this.props.currentObjective.objectiveWeight,
                this.props.objectiveName,
                this.props.currentObjective.dateStart,
                this.props.currentObjective.dateStop
              )}
            </span>
          </div>
          <Progress
            style={{ marginTop: "10px", height: "30px" }}
            value={this.calculateProgress(
              this.props.userStartWeight,
              this.props.userCurrentWeight,
              this.props.currentObjective.objectiveWeight,
              this.props.objectiveName,
              this.props.currentObjective.dateStart,
              this.props.currentObjective.dateStop
            )}
          >
            {this.calculateProgress(
              this.props.userStartWeight,
              this.props.userCurrentWeight,
              this.props.currentObjective.objectiveWeight,
              this.props.objectiveName,
              this.props.currentObjective.dateStart,
              this.props.currentObjective.dateStop
            )}
            %
          </Progress>
        </Card>
      ) : (
        <Card
          style={{
            width: "300px",
            marginLeft: "1300px",
            marginTop: "70px",
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <h3>Current objective</h3>
          <div>
            Name: <span>-</span>
          </div>
          <div>
            Date Start: <span>-</span>
          </div>
          <div>
            Date Stop: <span>-</span>
          </div>
          <div>
            Start Weight: <span>-</span>
          </div>
          <div>
            Objective Weight: <span>-</span>
          </div>
          <div>
            Current Weight: <span>-</span>
          </div>
          <div>
            Progress: <span>-</span>
          </div>
          <Progress style={{ marginTop: "10px", height: "30px" }} value={0}>
            0 %
          </Progress>
        </Card>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  currentObjective: state.userxobjective.currentObjective,
  objectiveName: state.userxobjective.objectiveName,
  userStartWeight: state.userxobjective.userStartWeight,
  userCurrentWeight: state.userxobjective.userCurrentWeight,
});

export default connect(mapStateToProps, { getCurrentObjective })(
  CurrentObjective
);
