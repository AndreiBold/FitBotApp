import React, { Component } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import p2 from "../../images/Home/p2.jpg";
import "./Slider.css";

class Slider extends Component {
  state = {
    activeIndex: 0,
    setActiveIndex: 0,
    animating: false,
    setAnimating: false,
    items: [
      {
        src: p2,
        caption:
          "It's all about calories. Getting in shape becomes much easier when you learn your numbers and stick with them daily. Let Jarvis help you with that!",
        altText: "Smart AI Kalculator",
      },
      {
        src:
          "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        caption:
          "Wanna know how intense and long your workouts really are? Check you the information about each exercise in the special section of the journal and become a master of your body!",
        altText: "Strength & Endurance",
      },
      {
        src:
          "https://images.unsplash.com/photo-1517673400267-0251440c45dc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        caption:
          "Be creative and mix fresh food with a supplement, for a delicious healthy meal. Track your foods by filling your personal daily journal with them! ",
        altText: "Foods & Supplements",
      },
      {
        src:
          "https://images.unsplash.com/photo-1530021545655-276a6d4dc6ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        caption:
          "Being flexible can be just as important as being strong. Jarvis has prepared a variety of exercises just for you. You should try them all!",
        altText: "Flexibility & Balance",
      },
    ],
  };

  next = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  previous = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  };

  goToIndex = (newIndex) => {
    if (this.state.animating) return;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const slides = this.state.items.map((item) => {
      return (
        <CarouselItem
          className="custom-tag"
          tag="div"
          onExiting={() => this.setState({ setAnimating: true })}
          onExited={() => this.setState({ setAnimating: false })}
          key={item.src}
        >
          <img
            className="carousel-img"
            src={item.src}
            alt={item.altText}
            width="100%"
            height="100%"
          />
          <CarouselCaption
            className="text-dark"
            captionHeader={item.altText}
            captionText={item.caption}
          />
        </CarouselItem>
      );
    });
    return (
      <div>
        <style>
          {`.custom-tag {
              width: 100%;
              height: 500px;
            }`}
        </style>
        <Carousel
          activeIndex={this.state.activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators
            items={this.state.items}
            activeIndex={this.state.activeIndex}
            onClickHandler={this.goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={this.previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={this.next}
          />
        </Carousel>
      </div>
    );
  }
}

export default Slider;
