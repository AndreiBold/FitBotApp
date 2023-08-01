import React, { Component } from "react";
import "./SearchSupplement.css";

class SearchSupplement extends Component {
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
    this.props.onSelectSupplement(id);
    this.props.show();
  };

  render() {
    let filteredSupplements = this.props.supplementList.filter((supplement) => {
      return (
        supplement.name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1
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
        <div className="supplementList">
          {filteredSupplements.map((item, index) => {
            return (
              <div
                style={{
                  color:
                    this.state.selectedId === item.supplementId ? "red" : "",
                }}
                key={index}
                onClick={() => this.triggerMethods(item.supplementId)}
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

export default SearchSupplement;
