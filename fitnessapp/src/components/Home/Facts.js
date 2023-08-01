import React, { Component } from "react";
import { Card } from "reactstrap";
import run from "../../images/Home/run.png";
import jarvislogo from "../../images/Home//jarvislogo.png";
import mrmuscle from "../../images/Home/mrmurscle.png";
import "./Facts.css";

class Facts extends Component {
  render() {
    return (
      <div className="row">
        <Card className="col-xs-12 col-sm-12 col-md-4 col-lg-4 home-card">
          <img
            src={run}
            alt="run"
            className="img-responsive"
            // style={{ marginLeft: "140px" }}
          />
          <h2 className="text-center">Did you know?</h2>
          <p className="text-center">
            It takes takes 3500 calories to burn one pound of fat. This means
            that if you eat in a caloric deficit of 500 calories, you will lose
            one pound in one week. Don't get discouraged. The Fitbot Team thinks
            that is the small steps like this one, that make the difference in
            the long run. Stay consistent and positive
          </p>
        </Card>
        <Card className="col-xs-12 col-sm-12 col-md-4 col-lg-4 home-card">
          <img
            src={jarvislogo}
            alt="newjarvis"
            className="img-responsive"
            // style={{ marginLeft: "140px" }}
          />
          <h2 className="text-center">Meet Jarvis - the Fitbot</h2>
          <p className="text-center">
            Think of Jarvis as your personal fitness trainer. He will help you
            get in shape by tracking your calories, foods and workouts. Using
            Machine Learning algorithms, he collects your personal data and
            calculates your daily macronutrients. You can ask him any fitness
            related information and he will give you the answer. Jarvis can also
            manage your personal journal, adding foods and exercises to it, if
            you will tell him to do so. Despite being a chatbot, he is
            constantly learning,cares about your progress and will motivate you
            constantly.
          </p>
        </Card>
        <Card
          id="card-ultim"
          className="col-xs-12 col-sm-12 col-md-4 col-lg-4 home-card"
        >
          <img
            src={mrmuscle}
            alt="fit"
            className="img-responsive"
            // style={{ marginLeft: "140px" }}
          />
          <h2 className="text-center">Train smart and consistent</h2>
          <p className="text-center">
            We know that sometimes changes can be tough. But with motivation and
            proper guidance, you will eventualy reach your goals. Tracking your
            progress is the first step in the road to success. On your account
            section, you will find your current objective, with the duration and
            progress in real time. At the end of each objective, you get an
            award. So stay focused and motivated.
          </p>
        </Card>
      </div>
    );
  }
}

export default Facts;
