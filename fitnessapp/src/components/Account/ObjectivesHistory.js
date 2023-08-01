import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getObjectivesHistory } from "../../actions/userxobjectiveActions";
import { ListGroup } from "reactstrap";
import ObjectiveDetails from "./ObjectiveDetails";

class ObjectivesHistory extends Component {
  static propTypes = {
    userObjectiveList: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.getObjectivesHistory();
  }

  render() {
    const lastObjectives = [];
    for (let i = 0; i < this.props.userObjectiveList.length - 1; i++) {
      lastObjectives.push(this.props.userObjectiveList[i]);
    }
    return (
      console.log(this.props.userObjectiveList),
      console.log(this.props.userObjectiveList[0]),
      (
        <div>
          <ListGroup
            style={{
              marginTop: "150px",
              width: "1100px",
              marginLeft: "100px",
              marginTop: "-250px",
              background: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <h3>Objectives history</h3>
            {lastObjectives.length > 0 ? (
              lastObjectives.map((item, key) => {
                return <ObjectiveDetails key={key} item={item} />;
              })
            ) : (
              <h3>
                Your objectives history is currently empty, but don't worry. We
                know that you can make history!
              </h3>
            )}
          </ListGroup>
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  userObjectiveList: state.userxobjective.userObjectiveList,
});

export default connect(mapStateToProps, { getObjectivesHistory })(
  ObjectivesHistory
);
