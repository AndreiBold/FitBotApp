import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getLatestFitnessDetails } from "../../actions/fitnessdetailActions";
import { Card } from "reactstrap";
import biceps1 from "../../images/Account/big.png";
import biceps2 from "../../images/Account/big2.png";

class FitnessDetails extends Component {
  static propTypes = {
    fitnessDetails: PropTypes.object.isRequired,
    getLatestFitnessDetails: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getLatestFitnessDetails();
  }

  render() {
    const {
      date,
      weight,
      height,
      mantainanceCalories,
      totalDailyCalories,
      protein,
      carbs,
      fats,
      dietType,
      activityLevel,
    } = this.props.fitnessDetails;
    return (
      <Card
        style={{
          width: "1000px",
          marginLeft: "400px",
          marginTop: "100px",
          background: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div>
          <img
            alt="bicep1"
            src={biceps2}
            style={{
              width: "200px",
              height: "200px",
              marginBottom: "-200px",
              marginLeft: "-600px",
              marginTop: "40px",
            }}
          />
          <h3>Fitness details</h3>
          <div>
            From: <span>{date ? date : "-"}</span>
          </div>
          <div>
            Weight: <span>{weight ? weight : "-"}</span>
          </div>
          <div>
            Height: <span>{height ? height : "-"}</span>
          </div>
          <div>
            Mantainance Calories:{" "}
            <span>{mantainanceCalories ? mantainanceCalories : "-"}</span>
          </div>
          <div>
            Total Daily Calories:{" "}
            <span>{totalDailyCalories ? totalDailyCalories : "-"}</span>
          </div>
          <div>
            Protein: <span>{protein ? protein : "-"}</span>
          </div>
          <div>
            Carbs: <span>{carbs ? carbs : "-"}</span>
          </div>
          <div>
            Fats: <span>{fats ? fats : "-"}</span>
          </div>
          <div>
            Diet Type: <span>{dietType ? dietType : "-"}</span>
          </div>
          <div>
            Activity Level: <span>{activityLevel ? activityLevel : "-"}</span>
          </div>
          <img
            alt="bicep2"
            src={biceps1}
            style={{
              width: "200px",
              height: "200px",
              marginLeft: "600px",
              marginTop: "-365px",
            }}
          />
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  fitnessDetails: state.fitnessdetail.fitnessDetails,
});

export default connect(mapStateToProps, { getLatestFitnessDetails })(
  FitnessDetails
);
