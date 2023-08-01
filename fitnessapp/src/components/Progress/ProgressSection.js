import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllFitnessDetails } from "../../actions/fitnessdetailActions";
import { Chart } from "primereact/chart";

class ProgressSection extends Component {
  static propTypes = {
    fitnessDetailsList: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    this.props.getAllFitnessDetails();
  }

  render() {
    const sortedList = [];
    for (let i = this.props.fitnessDetailsList.length - 1; i >= 0; i--) {
      sortedList.push(this.props.fitnessDetailsList[i]);
    }
    const data = {
      labels: sortedList.map((item) => item.date),
      datasets: [
        {
          label: "Weight",
          data: sortedList.map((item) =>
            parseInt(item.weight.match(/[a-zA-Z]+|[0-9]+/g)[0])
          ),
          fill: false,
          backgroundColor: "#66BB6A",
          borderColor: "#66BB6A",
        },
      ],
    };
    console.log(sortedList);
    return this.props.isAuthenticated ? (
      <div>
        <h3>View your weight progress weight!</h3>
        <Chart
          type="line"
          data={data}
          style={{ margin: "30px", width: "1000px", marginLeft: "200px" }}
        />
      </div>
    ) : (
      <h3>Please login if you want to have access to your progress</h3>
    );
  }
}

const mapStateToProps = (state) => ({
  fitnessDetailsList: state.fitnessdetail.fitnessDetailsList,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { getAllFitnessDetails })(
  ProgressSection
);
