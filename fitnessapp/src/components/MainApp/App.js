import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppNavbar from "../Navbar/AppNavbar";
import HomeSection from "../Home/HomeSection";
import Account from "../Account/AccountSection";
import TalkToJarvis from "../TalkToJarvis/TalkToJarvis";
import Progress from "../Progress/ProgressSection";
import Food from "../MyJournal/FoodSection";
import Exercises from "../MyJournal/ExerciseSection";
import Supplements from "../MyJournal/SupplementSection";
import Register from "../Navbar/Auth/Register";
import LogIn from "../Navbar/Auth/LogIn";
import LogOut from "../Navbar/Auth/LogOut";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ResetPassword from "../ForgotPassword/ResetPassword";
import store from "../../stores/store";
import { loadUser } from "../../actions/userActions";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <div className="App">
        <Router>
          <AppNavbar />
          <Switch>
            <Route exact path="/" component={HomeSection} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/logout" component={LogOut} />
            <Route exact path="/myjournal/foods" component={Food} />
            <Route exact path="/myjournal/exercises" component={Exercises} />
            <Route
              exact
              path="/myjournal/supplements"
              component={Supplements}
            />
            <Route exact path="/progress" component={Progress} />
            <Route exact path="/talktojarvis" component={TalkToJarvis} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset/:token" component={ResetPassword} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(null, null)(App);
