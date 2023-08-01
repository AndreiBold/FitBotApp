require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routers = require("./routers");
const cors = require("cors");

const app = express();
//BodyParser Middleware
app.use(bodyParser.json());
app.use(cors());

//mounting the router to the app
app.use("/users", routers.user);
app.use("/fitnessDetails", routers.fitnessDetail);
app.use("/foods", routers.food);
app.use("/usersXFoods", routers.userXFood);
app.use("/exercises", routers.exercise);
app.use("/usersXExercises", routers.userXExercise);
app.use("/supplements", routers.supplement);
app.use("/usersXSupplements", routers.userXSupplement);
app.use("/objectives", routers.objective);
app.use("/usersXObjectives", routers.userXObjective);
app.use("/contexts", routers.context);
app.use("/chat", routers.chat);

//set the PORT variable
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
