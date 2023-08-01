import React, { Component } from "react";
import "./SearchExercise.css";

class SearchExercise extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      selectedId: null,
    };
  }

  updateSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  changeColor = (id) => {
    this.setState({ selectedId: id });
  };

  triggerMethods = (id) => {
    this.changeColor(id);
    this.props.onSelectExercise(id);
    this.props.show();
  };

  render() {
    let filteredExercises = this.props.exerciseList.filter((exercise) => {
      return (
        exercise.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
        -1
      );
    });
    return (
      <div className="container">
        <input
          className="search-bar"
          type="text"
          value={this.state.search}
          onChange={this.updateSearch}
        />
        <div className="exerciseList">
          {filteredExercises.map((item, index) => {
            return (
              <div
                style={{
                  color: this.state.selectedId === item.exerciseId ? "red" : "",
                }}
                key={index}
                onClick={() => this.triggerMethods(item.exerciseId)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SearchExercise;
