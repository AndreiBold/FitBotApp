const { dockStart } = require("@nlpjs/basic");
const models = require("../models");

const trainJarvis = async () => {
  const dock = await dockStart({ use: ["Basic"] });
  const nlp = dock.get("nlp");
  await nlp.addCorpus("./jarvis/corpus.json");
  await nlp.train();

  return nlp;
};

const processFitnessDetailsForCalories = async (res, context, user) => {
  var state = res.intent;
  var lastFitnessDetails = await models.FitnessDetail.findAll({
    limit: 1,
    where: { userId: user.userId },
    order: [["date", "DESC"]],
  });
  switch (state) {
    case "change.objective":
      var changeObjective = res.utterance.match(/objective|new|goal/g)
        ? true
        : false;
      if (changeObjective) {
        return {
          response: res.answer,
          context: {
            state: "user.goal",
            action: "change objective",
          },
        };
      } else {
        return {
          response: "Didn't get that",
          context: context,
        };
      }
    case "change.fitness_info":
      var changeFitnessInfo = res.utterance.match(/change|fitness|details/g)
        ? true
        : false;
      if (changeFitnessInfo) {
        return {
          response: res.answer,
          context: {
            state: "user.weight",
            action: "change fitness info",
          },
        };
      } else {
        return {
          response: "Say that again please",
          context: context,
        };
      }
    case "user.goal":
      var loseWeight = res.utterance.match(/lose|shredded|ripped/g)
        ? true
        : false;
      var gainWeight = res.utterance.match(/gain|build|bigger|swole/g)
        ? true
        : false;
      var mantainWeight = res.utterance.match(/mantain|keep|actual/g)
        ? true
        : false;
      var savedAction = context.action ? context.action : "add fitness details";
      var reply = "";
      if (loseWeight || gainWeight || mantainWeight) {
        if (savedAction === "change objective") reply = res.answers[1].answer;
        else reply = res.answers[0].answer;
        return {
          response: reply,
          context: {
            state: "user.response",
            goal: loseWeight
              ? "lose weight"
              : gainWeight
              ? "gain weight"
              : "mantain weight",
            action: savedAction,
          },
        };
      } else {
        return {
          response: "say that again please",
          context: context,
        };
      }
    case "user.response":
      var yes = res.utterance.match(/yes|yep|sure|of|ok/g) ? true : false;
      var no = res.utterance.match(/no|nope|not|nada/g) ? true : false;
      var savedGoal = context.goal;
      savedAction = context.action;
      if (yes) {
        return {
          response: res.answers[0].answer,
          context: {
            state: "user.weight",
            goal: savedGoal,
            action: savedAction,
          },
        };
      } else if (no) {
        return {
          response: res.answers[1].answer,
          context: context,
        };
      } else {
        return {
          response:
            "Are you ok with me processing your personal data? It will be secured, don't worry.",
          context: context,
        };
      }
    case "user.weight":
      var savedWeight = res.utterance.match(/\d+|kgs/)
        ? res.utterance.match(/\d+|kgs/)[0]
        : false;
      var sameWeight = res.utterance.match(
        /weight is the same|weight didn't change/g
      )
        ? true
        : false;
      var lastWeight =
        lastFitnessDetails.length > 0
          ? lastFitnessDetails[0].weight.split("kgs")[0]
          : 0;
      savedGoal = context.goal;
      savedAction = context.action;
      if (savedWeight || sameWeight) {
        return {
          response: res.answer,
          context: {
            state: "user.height",
            goal: savedGoal,
            weight: savedWeight ? savedWeight : lastWeight,
            action: savedAction,
          },
        };
      } else {
        return {
          response: "Please tell me how much you weigh",
          context: context,
        };
      }
    case "user.height":
      var savedHeight = res.utterance.match(/\d+|cms/)
        ? res.utterance.match(/\d+|cms/)[0]
        : false;
      var sameHeight = res.utterance.match(
        /height is the same|height didn't change/g
      )
        ? true
        : false;
      var lastHeight =
        lastFitnessDetails.length > 0
          ? lastFitnessDetails[0].height.split("cms")[0]
          : 0;
      savedGoal = context.goal;
      savedWeight = context.weight;
      savedAction = context.action;
      if (
        (savedHeight && savedAction === "add fitness details") ||
        (savedHeight && savedAction === "change objective")
      ) {
        return {
          response: res.answer,
          context: {
            state: "user.age",
            goal: savedGoal,
            weight: savedWeight,
            height: savedHeight,
            action: savedAction,
          },
        };
      } else if (
        (savedAction === "change fitness info" && sameHeight) ||
        (savedAction === "change fitness info" && savedHeight)
      ) {
        return {
          response: "What about your diet?",
          context: {
            state: "user.diet",
            goal: savedGoal,
            weight: savedWeight,
            height: savedHeight ? savedHeight : lastHeight,
            action: savedAction,
          },
        };
      } else {
        return {
          response: "Please tell me how tall you are",
          context: context,
        };
      }
    case "user.age":
      var savedAge = res.utterance.match(/\d+|years/)[0];
      savedGoal = context.goal;
      savedWeight = context.weight;
      savedHeight = context.height;
      savedAction = context.action;
      if (savedAge) {
        return {
          response: res.answer,
          context: {
            state: "user.gender",
            goal: savedGoal,
            weight: savedWeight,
            height: savedHeight,
            age: savedAge,
            action: savedAction,
          },
        };
      } else {
        return {
          response: "Please tell your age",
          context: context,
        };
      }
    case "user.gender":
      var male = res.utterance.match(/M|male|man/g) ? true : false;
      var female = res.utterance.match(/F|female|woman/g) ? true : false;
      savedGoal = context.goal;
      savedWeight = context.weight;
      savedHeight = context.height;
      savedAge = context.age;
      savedAction = context.action;
      var BMR = 0;
      if (male) {
        BMR =
          10 * parseInt(savedWeight, 10) +
          6.25 * parseInt(savedHeight, 10) -
          5 * parseInt(savedAge, 10) +
          5;
      }
      if (female) {
        BMR =
          10 * parseInt(savedWeight, 10) +
          6.25 * parseInt(savedHeight, 10) -
          5 * parseInt(savedAge, 10) -
          161;
      }
      if (BMR !== 0) {
        return {
          response:
            "Awesome! Your BMR is " +
            Math.round(BMR) +
            " calories per day. This means that your body consumes " +
            Math.round(BMR) +
            " if you just stay in bed all day. Pretty crazy, right? Now I need to know your daily activity level.",
          context: {
            state: "user.activity_level",
            goal: savedGoal,
            weight: savedWeight,
            height: savedHeight,
            bmr: Math.round(BMR),
            action: savedAction,
          },
        };
      } else {
        return {
          response: "Please tell your gender",
          context: context,
        };
      }
    case "user.activity_level":
      var sendetary = res.utterance.match(/don't|sedentary|couch|not/g)
        ? true
        : false;
      var moderate = res.utterance.match(/moderate|medium|middle/g)
        ? true
        : false;
      var intense = res.utterance.match(/very|quite|lot|move/g) ? true : false;
      var caloriesForMantainance = 0;
      var savedBMR = context.bmr;
      savedGoal = context.goal;
      savedWeight = context.weight;
      savedHeight = context.height;
      savedAction = context.action;
      if (sendetary) {
        caloriesForMantainance = savedBMR * 1.3;
        if (savedGoal === "mantain_weight") {
          return {
            response:
              "You need to consume " +
              Math.round(caloriesForMantainance) +
              " calories daily, to mantain " +
              savedWeight +
              "kgs. For how long do you want to mantain your weight?",
            context: {
              state: "objective.details",
              weight: savedWeight,
              height: savedHeight,
              activityLevel: "sedentary",
              mantainanceCalories: Math.round(caloriesForMantainance),
              goal: savedGoal,
              action: savedAction,
            },
          };
        } else {
          return {
            response:
              "You need to consume " +
              Math.round(caloriesForMantainance) +
              " calories daily, to mantain " +
              savedWeight +
              "kgs. Now tell me what is your desired weight.",
            context: {
              state: "objective.details",
              weight: savedWeight,
              height: savedHeight,
              activityLevel: "sedentary",
              mantainanceCalories: Math.round(caloriesForMantainance),
              goal: savedGoal,
              action: savedAction,
            },
          };
        }
      } else if (moderate) {
        caloriesForMantainance = savedBMR * 1.5;
        if (savedGoal === "mantain_weight") {
          return {
            response:
              "You need to consume " +
              Math.round(caloriesForMantainance) +
              " calories daily, to mantain " +
              savedWeight +
              "kgs. For how long do you want to mantain your weight?",
            context: {
              state: "objective.details",
              weight: savedWeight,
              height: savedHeight,
              activityLevel: "moderate",
              mantainanceCalories: Math.round(caloriesForMantainance),
              goal: savedGoal,
              action: savedAction,
            },
          };
        } else {
          return {
            response:
              "You need to consume " +
              Math.round(caloriesForMantainance) +
              " calories daily, to mantain " +
              savedWeight +
              "kgs. Now tell me what is your desired weight.",
            context: {
              state: "objective.details",
              weight: savedWeight,
              height: savedHeight,
              activityLevel: "moderate",
              mantainanceCalories: Math.round(caloriesForMantainance),
              goal: savedGoal,
              action: savedAction,
            },
          };
        }
      } else if (intense) {
        caloriesForMantainance = savedBMR * 1.7;
        if (savedGoal === "mantain_weight") {
          return {
            response:
              "You need to consume " +
              Math.round(caloriesForMantainance) +
              " calories daily, to mantain " +
              savedWeight +
              "kgs. For how long do you want to mantain your weight?",
            context: {
              state: "objective.details",
              weight: savedWeight,
              height: savedHeight,
              activityLevel: "intense",
              mantainanceCalories: Math.round(caloriesForMantainance),
              goal: savedGoal,
              action: savedAction,
            },
          };
        } else {
          return {
            response:
              "You need to consume " +
              Math.round(caloriesForMantainance) +
              " calories daily, to mantain " +
              savedWeight +
              "kgs. Now tell me what is your desired weight.",
            context: {
              state: "objective.details",
              weight: savedWeight,
              height: savedHeight,
              activityLevel: "intense",
              mantainanceCalories: Math.round(caloriesForMantainance),
              goal: savedGoal,
              action: savedAction,
            },
          };
        }
      } else {
        return {
          response: "Please tell me how active you are.",
          context: context,
        };
      }
    case "objective.details":
      var weightGoal = res.utterance.match(/\d+|kgs/g)[0];
      var daysToMantain = res.utterance.match(/\d+|days|day/g)[0];
      var savedMantainanceCalories = context.mantainanceCalories;
      var savedActivityLevel = context.activityLevel;
      var totalDailyCalories = 0;
      var noDays = 0;
      var protein = "";
      var carbs = "";
      var fats = "";
      savedGoal = context.goal;
      savedWeight = context.weight;
      savedHeight = context.height;
      savedAction = context.action;
      if (
        weightGoal &&
        savedGoal === "lose weight" &&
        savedActivityLevel === "sedentary"
      ) {
        noDays = ((parseInt(savedWeight) - parseInt(weightGoal)) * 7) / 0.5;
        totalDailyCalories = savedMantainanceCalories - 500;
        protein = Math.round(parseInt(savedWeight) - (0.1 * 250) / 4);
        fats = Math.round(
          (0.2 * savedMantainanceCalories) / 9 - (0.2 * 250) / 9
        );
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order for you to reach your weight goal, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            noDays +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: weightGoal,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            goal: savedGoal,
            noDays: noDays,
            action: savedAction,
          },
        };
      } else if (
        weightGoal &&
        savedGoal === "lose weight" &&
        savedActivityLevel === "moderate"
      ) {
        noDays = ((parseInt(savedWeight) - parseInt(weightGoal)) * 7) / 0.5;
        totalDailyCalories = savedMantainanceCalories - 500;
        protein = Math.round(
          (parseInt(savedWeight) * 0.75) / 0.5 - (0.13 * 250) / 4
        );
        fats = Math.round(
          (0.25 * savedMantainanceCalories) / 9 - (0.25 * 250) / 9
        );
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order for you to reach your weight goal, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            noDays +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: weightGoal,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            goal: savedGoal,
            noDays: noDays,
            action: savedAction,
          },
        };
      } else if (
        weightGoal &&
        savedGoal === "lose weight" &&
        savedActivityLevel === "intense"
      ) {
        noDays = ((parseInt(savedWeight) - parseInt(weightGoal)) * 7) / 0.5;
        totalDailyCalories = savedMantainanceCalories - 500;
        protein = Math.round(parseInt(savedWeight) * 2 - (0.15 * 250) / 4);
        fats = Math.round(
          (0.3 * savedMantainanceCalories) / 9 - (0.3 * 250) / 9
        );
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order for you to reach your weight goal, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            noDays +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: weightGoal,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            goal: savedGoal,
            noDays: noDays,
            action: savedAction,
          },
        };
      } else if (
        weightGoal &&
        savedGoal === "gain weight" &&
        savedActivityLevel === "sedentary"
      ) {
        noDays = ((parseInt(weightGoal) - parseInt(savedWeight)) * 7) / 0.5;
        totalDailyCalories = savedMantainanceCalories + 500;
        protein = Math.round(parseInt(savedWeight) + (0.1 * 250) / 4);
        fats = Math.round(
          (0.2 * savedMantainanceCalories) / 9 + (0.2 * 250) / 9
        );
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order for you to reach your weight goal, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            noDays +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: weightGoal,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            goal: savedGoal,
            noDays: noDays,
            action: savedAction,
          },
        };
      } else if (
        weightGoal &&
        savedGoal === "gain weight" &&
        savedActivityLevel === "moderate"
      ) {
        noDays = ((parseInt(weightGoal) - parseInt(savedWeight)) * 7) / 0.5;
        totalDailyCalories = savedMantainanceCalories + 500;
        protein = Math.round(
          (parseInt(savedWeight) * 0.75) / 0.5 + (0.13 * 250) / 4
        );
        fats = Math.round(
          (0.25 * savedMantainanceCalories) / 9 + (0.25 * 250) / 9
        );
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order for you to reach your weight goal, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            noDays +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: weightGoal,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            goal: savedGoal,
            noDays: noDays,
            action: savedAction,
          },
        };
      } else if (
        weightGoal &&
        savedGoal === "gain weight" &&
        savedActivityLevel === "intense"
      ) {
        noDays = ((parseInt(weightGoal) - parseInt(savedWeight)) * 7) / 0.5;
        totalDailyCalories = savedMantainanceCalories + 500;
        protein = Math.round(parseInt(savedWeight) * 2 + (0.15 * 250) / 4);
        fats = Math.round(
          (0.3 * savedMantainanceCalories) / 9 + (0.3 * 250) / 9
        );
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order for you to reach your weight goal, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            noDays +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: weightGoal,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            goal: savedGoal,
            noDays: noDays,
            action: savedAction,
          },
        };
      } else if (daysToMantain && savedActivityLevel === "sedentary") {
        totalDailyCalories = savedMantainanceCalories;
        protein = Math.round(parseInt(savedWeight));
        fats = Math.round((0.2 * savedMantainanceCalories) / 9);
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order to be consistent with your perfect weight, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            daysToMantain +
            " days.  One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: savedWeight,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            noDays: daysToMantain,
            goal: savedGoal,
            action: savedAction,
          },
        };
      } else if (daysToMantain && savedActivityLevel === "moderate") {
        totalDailyCalories = savedMantainanceCalories;
        protein = Math.round((parseInt(savedWeight) * 0.75) / 0.5);
        fats = Math.round((0.25 * savedMantainanceCalories) / 9);
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order to be consistent with your perfect weight, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            daysToMantain +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: savedWeight,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            noDays: daysToMantain,
            goal: savedGoal,
            action: savedAction,
          },
        };
      } else if (daysToMantain && savedActivityLevel === "intense") {
        totalDailyCalories = savedMantainanceCalories;
        protein = Math.round(parseInt(savedWeight) * 2);
        fats = Math.round((0.3 * savedMantainanceCalories) / 9);
        carbs = Math.round((totalDailyCalories - protein * 4 - fats * 9) / 4);
        return {
          response:
            "Perfect. In order to be consistent with your perfect weight, I recommend you to eat " +
            totalDailyCalories +
            " for " +
            daysToMantain +
            " days. One last thing.. Tell me any objection that you have on foods.",
          context: {
            state: "user.diet",
            weight: savedWeight,
            desiredWeight: savedWeight,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: totalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: protein,
            fats: fats,
            carbs: carbs,
            noDays: daysToMantain,
            goal: savedGoal,
            action: savedAction,
          },
        };
      } else {
        return {
          response: "Something went wrong",
          context: context,
        };
      }
    case "user.diet":
      var vegan = res.utterance.match(/no fan of meat|vegan|avoid meat/g)
        ? true
        : false;
      var sugarFree = res.utterance.match(/no sugar|avoid sugar|glucose/g)
        ? true
        : false;
      var flexible = res.utterance.match(/all foods|zero objections|anything/g)
        ? true
        : false;
      var savedDesiredWeight = context.desiredWeight;
      var savedTotalDailyCalories = context.totalDailyCalories;
      var savedProtein = context.protein;
      var savedFats = context.fats;
      var savedCarbs = context.carbs;
      var savedNoDays = context.noDays;
      savedWeight = context.weight;
      savedHeight = context.height;
      savedMantainanceCalories = context.mantainanceCalories;
      savedActivityLevel = context.activityLevel;
      savedGoal = context.goal;
      savedAction = context.action;
      if (
        (vegan && savedAction === "change objective") ||
        (vegan && savedAction === "add fitness details")
      ) {
        return {
          response:
            "That's it! I just added your fitness info and your objective in the account section of the app. You can check it out.",
          context: {
            state: "user.feedback",
            weight: savedWeight,
            desiredWeight: savedDesiredWeight,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: savedTotalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: savedProtein,
            fats: savedFats,
            carbs: savedCarbs,
            noDays: savedNoDays,
            goal: savedGoal,
            dietType: "vegan",
            action: savedAction,
          },
        };
      } else if (
        (sugarFree && savedAction === "change objective") ||
        (sugarFree && savedAction === "add fitness details")
      ) {
        return {
          response:
            "That's it! I just added your fitness info and your objective in the account section of the app. You can check it out.",
          context: {
            state: "user.feedback",
            weight: savedWeight,
            desiredWeight: savedDesiredWeight,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: savedTotalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: savedProtein,
            fats: savedFats,
            carbs: savedCarbs,
            noDays: savedNoDays,
            goal: savedGoal,
            dietType: "sugar free",
            action: savedAction,
          },
        };
      } else if (
        (flexible && savedAction === "change objective") ||
        (flexible && savedAction === "add fitness details")
      ) {
        return {
          response:
            "That's it! I just added your fitness info and your objective in the account section of the app. You can check it out.",
          context: {
            state: "user.feedback",
            weight: savedWeight,
            desiredWeight: savedDesiredWeight,
            height: savedHeight,
            mantainanceCalories: savedMantainanceCalories,
            totalDailyCalories: savedTotalDailyCalories,
            activityLevel: savedActivityLevel,
            protein: savedProtein,
            fats: savedFats,
            carbs: savedCarbs,
            noDays: savedNoDays,
            goal: savedGoal,
            dietType: "flexible",
            action: savedAction,
          },
        };
      } else if (savedAction === "change fitness info") {
        return {
          response:
            "All right then. You fitness details are now updated as you requested.",
          context: {
            state: "user.feedback",
            weight: savedWeight,
            height: savedHeight,
            dietType: vegan ? "vegan" : sugarFree ? "sugar free" : "flexible",
            action: savedAction,
          },
        };
      } else {
        return {
          response: "Something went wrong",
          context: context,
        };
      }
    case "user.feedback":
      var feedback = res.utterance.match(/you are|you make|such a useful bot/g)
        ? true
        : false;
      if (feedback) {
        return {
          response: res.answer,
          context: context,
        };
      } else {
        return {
          response: "Didn't get that.",
          context: context,
        };
      }
    default:
      return {
        response: "I don't understand",
        context: context,
      };
  }
};

const manageJournal = async (res, context) => {
  var state = res.intent;
  if (state === "food.insert" || state === "food.delete") {
    var addFood = res.utterance.match(/add food|prepare food|cook food/g)
      ? true
      : false;
    var deleteFood = res.utterance.match(/delete food|erase food|remove food/g)
      ? true
      : false;
    if (addFood || deleteFood) {
      return {
        response: res.answer,
        context: {
          state: "food.name",
          action: addFood ? "insert food" : "delete food",
        },
      };
    } else {
      return {
        response: "Say that again please",
        context: context,
      };
    }
  }

  if (state === "supplement.insert" || state === "supplement.delete") {
    var addSupplement = res.utterance.match(
      /add supplement|prepare supplement|cook supplement/g
    )
      ? true
      : false;
    var deleteSupplement = res.utterance.match(
      /delete supplement|erase supplement|remove supplement/g
    )
      ? true
      : false;
    if (addSupplement || deleteSupplement) {
      return {
        response: res.answer,
        context: {
          state: "supplement.name",
          action: addSupplement ? "insert supplement" : "delete supplement",
        },
      };
    } else {
      return {
        response: "Say that again please",
        context: context,
      };
    }
  }

  if (state === "exercise.insert" || state === "exercise.delete") {
    var addExercise = res.utterance.match(
      /add exercise|prepare exercise|insert exercise/g
    )
      ? true
      : false;
    var deleteExercise = res.utterance.match(
      /delete exercise|erase exercise|remove exercise/g
    )
      ? true
      : false;
    if (addExercise || deleteExercise) {
      return {
        response: res.answer,
        context: {
          state: "exercise.name",
          action: addExercise ? "insert exercise" : "delete exercise",
        },
      };
    } else {
      return {
        response: "Say that again please",
        context: context,
      };
    }
  }

  if (state === "food.name") {
    var savedAction = context.action;
    var savedFoodName = res.utterance;
    if (savedFoodName) {
      return {
        response: res.answer,
        context: {
          state: "meal.nr",
          action: savedAction,
          foodName: savedFoodName,
        },
      };
    } else {
      return {
        response: "Please tell me the name of this food.",
        context: context,
      };
    }
  }

  if (state === "supplement.name") {
    var savedAction = context.action;
    var savedSupplementName = res.utterance;
    if (savedAction === "insert supplement" && savedSupplementName) {
      return {
        response: res.answer,
        context: {
          state: "no.units",
          action: savedAction,
          supplementName: savedSupplementName,
        },
      };
    } else if (savedAction === "delete supplement" && savedSupplementName) {
      return {
        response:
          "That's it. I removed " + savedSupplementName + " from your journal",
        context: {
          state: "user.thank",
          action: savedAction,
          supplementName: savedSupplementName,
        },
      };
    } else {
      return {
        response: "Please tell me the name of this supplement.",
        context: context,
      };
    }
  }

  if (state === "exercise.name") {
    var savedAction = context.action;
    var savedExerciseName = res.utterance;
    if (savedExerciseName) {
      return {
        response: res.answer,
        context: {
          state: "workout.nr",
          action: savedAction,
          exerciseName: savedExerciseName,
        },
      };
    } else {
      return {
        response: "Please tell me the name of this exercise.",
        context: context,
      };
    }
  }

  if (state === "meal.nr") {
    var savedMealNr = res.utterance.match(/\d+|meal/g)[1];
    savedAction = context.action;
    savedFoodName = context.foodName;
    if (savedMealNr && savedAction === "insert food") {
      return {
        response:
          "Perfect. And how much " + savedFoodName + " would you like to eat?",
        context: {
          state: "no.units",
          action: savedAction,
          foodName: savedFoodName,
          mealNumber: savedMealNr,
        },
      };
    } else if (savedMealNr && savedAction === "delete food") {
      return {
        response:
          "Perfect. I have just removed the " +
          savedFoodName +
          " from your journal",
        context: {
          state: "user.thank",
          action: savedAction,
          foodName: savedFoodName,
          mealNumber: savedMealNr,
        },
      };
    } else {
      return {
        response: "Please tell me the meal number of this food",
        context: context,
      };
    }
  }

  if (state === "workout.nr") {
    var savedWorkoutNr = res.utterance.match(/\d+|workout/g)[1];
    savedAction = context.action;
    savedExerciseName = context.exerciseName;
    if (savedWorkoutNr && savedAction === "insert exercise") {
      return {
        response: res.answer,
        context: {
          state: "no.minutes",
          action: savedAction,
          exerciseName: savedExerciseName,
          workoutNumber: savedWorkoutNr,
        },
      };
    } else if (savedWorkoutNr && savedAction === "delete exercise") {
      return {
        response:
          "Perfect. I have just removed the " +
          savedExerciseName +
          " from your journal",
        context: {
          state: "user.thank",
          action: savedAction,
          exerciseName: savedExerciseName,
          workoutNumber: savedWorkoutNr,
        },
      };
    } else {
      return {
        response: "Please tell me the workout number of this exercise",
        context: context,
      };
    }
  }

  if (state === "no.units") {
    var savedNoUnits = res.utterance.match(/\d+|grams|cups|scoops|pills/g)[0];
    savedAction = context.action;
    savedFoodName = context.foodName;
    savedSupplementName = context.supplementName;
    savedMealNr = context.mealNumber;
    if (savedNoUnits && savedFoodName) {
      return {
        response:
          "Very nice. Can you tell me any other details about your food?",
        context: {
          state: "journal.details",
          foodName: savedFoodName,
          mealNumber: savedMealNr,
          noUnits: savedNoUnits,
          action: savedAction,
        },
      };
    } else if (savedNoUnits && savedSupplementName) {
      return {
        response:
          "Very nice. Can you tell me any other details about your supplement?",
        context: {
          state: "journal.details",
          supplementName: savedSupplementName,
          noUnits: savedNoUnits,
          action: savedAction,
        },
      };
    } else {
      return {
        response:
          "Please tell me how much " + savedFoodName
            ? savedFoodName
            : savedSupplementName + " do you want to eat.",
        context: context,
      };
    }
  }

  if (state === "no.minutes") {
    var savedNoMinutes = res.utterance.match(/\d+|grams|cups|scoops/g)[0];
    savedAction = context.action;
    savedExerciseName = context.exerciseName;
    savedWorkoutNr = context.workoutNumber;
    if (savedNoMinutes) {
      return {
        response:
          "Very nice. Can you tell me any other details about your exercise?",
        context: {
          state: "journal.details",
          exerciseName: savedExerciseName,
          workoutNumber: savedWorkoutNr,
          noMinutes: savedNoMinutes,
          action: savedAction,
        },
      };
    } else {
      return {
        response:
          "Please tell me for how long you want to do " + savedExerciseName,
        context: context,
      };
    }
  }

  if (state === "journal.details") {
    var savedDetails = res.utterance;
    savedAction = context.action;
    savedFoodName = context.foodName;
    savedSupplementName = context.supplementName;
    savedExerciseName = context.exerciseName;
    savedMealNr = context.mealNumber;
    savedWorkoutNr = context.workoutNumber;
    savedNoUnits = context.noUnits;
    savedNoMinutes = context.noMinutes;
    if (savedDetails && savedFoodName) {
      return {
        response:
          "That's it. I have just added the " +
          savedFoodName +
          " to your journal",
        context: {
          state: "user.thank",
          foodName: savedFoodName,
          mealNumber: savedMealNr,
          noUnits: savedNoUnits,
          details: savedDetails,
          action: savedAction,
        },
      };
    } else if (savedDetails && savedSupplementName) {
      return {
        response:
          "That's it. I have just added the " +
          savedSupplementName +
          " to your journal",
        context: {
          state: "user.thank",
          supplementName: savedSupplementName,
          noUnits: savedNoUnits,
          details: savedDetails,
          action: savedAction,
        },
      };
    } else if (savedDetails && savedExerciseName) {
      return {
        response:
          "That's it. I have just added the " +
          savedExerciseName +
          " to your journal",
        context: {
          state: "user.thank",
          exerciseName: savedExerciseName,
          noMinutes: savedNoMinutes,
          workoutNumber: savedWorkoutNr,
          details: savedDetails,
          action: savedAction,
        },
      };
    } else {
      return {
        response:
          "Please give me one more detail about your " + savedFoodName
            ? savedFoodName
            : savedSupplementName,
        context: context,
      };
    }
  }

  if (state === "user.thank") {
    var thank = res.utterance.match(/th|Th/g) ? true : false;
    savedAction = context.action;
    if (thank) {
      return {
        response: res.answer,
        context: {
          state: "goodbye.bye",
          action: savedAction,
        },
      };
    } else {
      return {
        response: "Didn't get that.",
        context: context,
      };
    }
  }
  return {
    response: "Sorry, I didn't understand.",
    context: context,
  };
};

const processChat = async (message, context, nlp, user) => {
  try {
    const res = await nlp.process("en", message);
    console.log(res);
    var ctx = await models.Context.findOne({
      where: { userId: user.userId },
    });

    if (
      ctx &&
      ctx.content.action === "insert food" &&
      res.utterance === "how are you"
    )
      return {
        response: "Hey there, " + user.firstName + ". Did you enjoy your meal?",
        context: {
          state: res.intent,
        },
      };
    if (
      ctx &&
      ctx.content.action === "insert supplement" &&
      res.utterance === "how are you"
    )
      return {
        response:
          "Hey there, " +
          user.firstName +
          ". Did you feel any improvement after taking that supplement?",
        context: context,
      };
    if (
      ctx &&
      ctx.content.action === "insert exercise" &&
      res.utterance === "how are you"
    )
      return {
        response: "Hey there, " + user.firstName + ". How was your workout?",
        context: {
          state: res.intent,
        },
      };

    if (
      res.intent.match(
        /objective|goal|response|weight|height|age|gender|activity|diet|feedback|fitness|change/g
      )
    )
      return processFitnessDetailsForCalories(res, context, user);

    if (
      res.intent.match(
        /food|exercise|supplement|meal|workout|units|minutes|journal|thank/g
      )
    )
      return manageJournal(res, context);

    if (res.intent === "greetings.hello") {
      return {
        response:
          "Hi, " + user.firstName + "! I'm Jarvis. How can I help you today?",
        context: {
          state: res.intent,
        },
      };
    }

    return {
      response: res.answer,
      context: context,
    };
  } catch (err) {
    console.warn(err);
  }
};

module.exports = {
  processChat,
  trainJarvis,
};
