import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button } from "reactstrap";
import PropTypes from "prop-types";
import { animateScroll } from "react-scroll";
import { userMessage, botMessage } from "../../actions/chatActions";
import {
  addFitnessDetails,
  updateFitnessDetails,
} from "../../actions/fitnessdetailActions";
import {
  addUserObjective,
  updateCurrentObjective,
} from "../../actions/userxobjectiveActions";
import {
  addUserFoodByBot,
  deleteUserFoodByBot,
} from "../../actions/userxfoodActions";
import {
  addUserSupplementByBot,
  deleteUserSupplementByBot,
} from "../../actions/userxsupplementActions";
import {
  addUserExerciseByBot,
  deleteUserExerciseByBot,
} from "../../actions/userxexerciseActions";
import { saveContext } from "../../actions/contextActions.js";
import { simpleFormatDate, getFutureDate, formatDate } from "../../utils/utils";
import "./TalkToJarvis.css";
import jarvis from "../../images/Home/jarvislogo.png";
import boi from "../../images/Home/boi.png";
import coinbot from '../../images/Home/coinbot.png';

class TalkToJarvis extends Component {
  state = {
    message: "",
    ctx: {},
  };

  static propTypes = {
    userMessage: PropTypes.func.isRequired,
    botMessage: PropTypes.func.isRequired,
    addFitnessDetails: PropTypes.func.isRequired,
    updateFitnessDetails: PropTypes.func.isRequired,
    addUserObjective: PropTypes.func.isRequired,
    updateCurrentObjective: PropTypes.func.isRequired,
    addUserFoodByBot: PropTypes.func.isRequired,
    deleteUserFoodByBot: PropTypes.func.isRequired,
    addUserSupplementByBot: PropTypes.func.isRequired,
    deleteUserSupplementByBot: PropTypes.func.isRequired,
    addUserExerciseByBot: PropTypes.func.isRequired,
    deleteUserExerciseByBot: PropTypes.func.isRequired,
    saveContext: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    response: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "historyContainer",
    });
  }

  send = async () => {
    let ctx = {};

    await this.props.userMessage(this.state.message);

    await this.props.botMessage({
      context: this.state.ctx,
      message: this.state.message,
    });

    ctx = this.props.response.context;
    this.setState({ ctx: ctx });

    if (this.props.response.context.state === "user.feedback") {
      var weight = this.props.response.context.weight + "kgs";
      var height = this.props.response.context.height + "cms";
      var mantainanceCalories = parseFloat(
        this.props.response.context.mantainanceCalories
      );
      var totalDailyCalories = parseFloat(
        this.props.response.context.totalDailyCalories
      );
      var date = simpleFormatDate(new Date());
      var dateStop = simpleFormatDate(
        getFutureDate(parseInt(this.props.response.context.noDays))
      );
      var objectiveWeight = this.props.response.context.desiredWeight + "kgs";

      if (this.props.response.context.action === "change fitness info") {
        await this.props.updateFitnessDetails({
          date: date,
          weight: weight,
          height: height,
          dietType: this.props.response.context.dietType,
        });
      }

      if (this.props.response.context.action === "change objective") {
        await this.props.updateCurrentObjective();

        await this.props.addFitnessDetails({
          date: date,
          weight: weight,
          height: height,
          mantainanceCalories: mantainanceCalories,
          totalDailyCalories: totalDailyCalories,
          protein: this.props.response.context.protein,
          fats: this.props.response.context.fats,
          carbs: this.props.response.context.carbs,
          dietType: this.props.response.context.dietType,
          activityLevel: this.props.response.context.activityLevel,
        });

        await this.props.addUserObjective({
          name: this.props.response.context.goal,
          dateStart: date,
          dateStop: dateStop,
          objectiveWeight: objectiveWeight,
        });
      }

      if (this.props.response.context.action === "add fitness details") {
        await this.props.addFitnessDetails({
          date: date,
          weight: weight,
          height: height,
          mantainanceCalories: mantainanceCalories,
          totalDailyCalories: totalDailyCalories,
          protein: this.props.response.context.protein,
          fats: this.props.response.context.fats,
          carbs: this.props.response.context.carbs,
          dietType: this.props.response.context.dietType,
          activityLevel: this.props.response.context.activityLevel,
        });

        await this.props.addUserObjective({
          name: this.props.response.context.goal,
          dateStart: date,
          dateStop: dateStop,
          objectiveWeight: objectiveWeight,
        });
      }
    }

    if (this.props.response.context.state === "user.thank") {
      var mealNumber = this.props.response.context.mealNumber
        ? parseInt(this.props.response.context.mealNumber.match(/\d+/)[0])
        : "";
      var workoutNumber = this.props.response.context.workoutNumber
        ? parseInt(this.props.response.context.workoutNumber.match(/\d+/)[0])
        : "";
      var noUnits = parseInt(this.props.response.context.noUnits);
      var minutesDuration = parseInt(this.props.response.context.noMinutes);
      var dateTime = formatDate(new Date());

      if (this.props.response.context.action === "insert food")
        await this.props.addUserFoodByBot({
          name: this.props.response.context.foodName,
          mealNumber: mealNumber,
          noUnits: noUnits,
          details: this.props.response.context.details,
          dateTime: dateTime,
        });

      if (this.props.response.context.action === "delete food")
        await this.props.deleteUserFoodByBot({
          name: this.props.response.context.foodName,
          mealNumber: mealNumber,
        });

      if (this.props.response.context.action === "insert supplement")
        await this.props.addUserSupplementByBot({
          name: this.props.response.context.supplementName,
          noUnits: noUnits,
          details: this.props.response.context.details,
          dateTime: dateTime,
        });

      if (this.props.response.context.action === "delete supplement")
        await this.props.deleteUserSupplementByBot(
          this.props.response.context.supplementName
        );

      if (this.props.response.context.action === "insert exercise")
        await this.props.addUserExerciseByBot({
          name: this.props.response.context.exerciseName,
          workoutNumber: workoutNumber,
          minutesDuration: minutesDuration,
          details: this.props.response.context.details,
          dateTime: dateTime,
        });

      if (this.props.response.context.action === "delete exercise")
        await this.props.deleteUserExerciseByBot({
          name: this.props.response.context.exerciseName,
          workoutNumber: workoutNumber,
        });
    }

    if (this.props.response.context.state === "goodbye.bye")
      await this.props.saveContext({
        dateTime: formatDate(new Date()),
        content: this.props.response.context,
      });

    this.clearState();
  };

  clearState = () => {
    this.setState({
      message: "",
    });
  };

  render() {
    // console.log("STAREA ", this.state);
    // console.log("RASPUNSUL INTREG ", this.props.response);
    // console.log("RASPUNSUL ", this.props.response.response);
    // console.log("CONTEXTUL ", this.props.response.context);
    // console.log("MESAJE ", this.props.messages);
    // console.log("-----------------------------------------");
    return this.props.isAuthenticated ? (
      <div id="chat">
        <div className="conv-head">
          <img className="conv-icon" alt="bot" src={coinbot} />
          <h2 className="conv-title">Wally - Your WalletBot</h2>
        </div>
        <div id="historyContainer">
          {this.props.messages.length === 0
            ? ""
            : this.props.messages.map((msg, index) => (
                <div key={index} className={msg.type}>
                  {msg.type === "bot" ? (
                    <div>
                      <img className="chat-icon" alt="bot" src={coinbot} />
                      <div>{msg.message.response}</div>
                    </div>
                  ) : (
                    <div>
                      <img className="chat-icon" alt="user" src={boi} />
                      <div>{msg.message}</div>
                    </div>
                  )}
                </div>
              ))}
        </div>
        <Input
          type="text"
          name="message"
          id="message"
          placeholder="Text Message"
          onChange={this.handleChange}
          value={this.state.message}
          style={{ width: "350px", marginLeft: "20px" }}
        />
        <Button
          color="success"
          size="md"
          onClick={() => this.send()}
          style={{ marginLeft: "370px", marginTop: "-67px" }}
        >
          Send
        </Button>
      </div>
    ) : (
      <h3>Please login if you want to talk to Jarvis</h3>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  response: state.chat.response,
  messages: state.chat.messages,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, {
  userMessage,
  botMessage,
  addFitnessDetails,
  updateFitnessDetails,
  addUserObjective,
  updateCurrentObjective,
  deleteUserFoodByBot,
  addUserFoodByBot,
  addUserSupplementByBot,
  deleteUserSupplementByBot,
  addUserExerciseByBot,
  deleteUserExerciseByBot,
  saveContext,
})(TalkToJarvis);
