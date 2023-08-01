import React, { Component } from "react";
import "./SearchFood.css";

class SearchFood extends Component {
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
    this.props.onSelectFood(id);
    this.props.show();
  };

  render() {
    let filteredFoods = this.props.foodList.filter((food) => {
      return (
        food.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
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
        <div className="foodList">
          {filteredFoods.map((item, index) => {
            return (
              <div
                style={{
                  color: this.state.selectedId === item.foodId ? "red" : "",
                }}
                key={index}
                onClick={() => this.triggerMethods(item.foodId)}
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

export default SearchFood;
