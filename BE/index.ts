import express from "express";
import path from "path";
import { challengeRouter } from "./routes/challenge-router";
import { Status, StatusState } from "./types";

import listOfChallenges from "./data/listOfChallenges.json";
import achievements from "./data/achievements.json";
import {
  calculateAchievementsStatus,
  getAchievements,
  getCurrentTask,
} from "./helpers";

const schedule = require("node-schedule");

const app = express();
const port = 3000;
const server = require("http").createServer(app);
const io = require("socket.io")(server);

schedule.scheduleJob("* * 23 * *", () => {
  console.log("check that current task completed!");
  Object.values(listOfChallenges).forEach(challenge => {
    /** Set the current task status to Failure at 12 AM every day during the challenge,
     *  if the task was not completed by a user this day */
    const currentTask = getCurrentTask(challenge.id);
    if (currentTask.status.state !== StatusState.Success) {
      currentTask.status.state = StatusState.Failure;
    }
    /** Calculate the achievements status and the challenge state
     *  at 12 AM of the last day of the challenge */
    const listOfAchievements = Object.values(achievements);
    const tasksStatus: Status[] = Object.values(
      (<any>listOfChallenges)[challenge.id].tasksStatus,
    );
    const achievementStatus = calculateAchievementsStatus(
      listOfAchievements,
      tasksStatus,
    );
    console.log("currentTask status", currentTask.status.state);
    console.log("achievementStatus ", achievementStatus);
  });
});

io.on("connection", (socket: any) => {
  console.log("a user connected to server");
  socket.on("current task is completed", (challengeId: string) => {
    console.log("current task is completed");
    const currentTask = getCurrentTask(challengeId);
    currentTask.status.state = StatusState.Success;

    const actualAchievements = getAchievements(challengeId);
    const listOfAchievements = Object.values(actualAchievements);
    const tasksStatus: Status[] = Object.values(
      (<any>listOfChallenges)[challengeId].tasksStatus,
    );
    const achievementStatus = calculateAchievementsStatus(
      listOfAchievements,
      tasksStatus,
    );
    console.log("currentTask.status.state", currentTask.status.state);
    socket.emit("calculated achievements status", achievementStatus);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.status(200).sendFile("views/index.html", { root: __dirname });
});

app.use("/challenge/", challengeRouter);
app.use(express.static(path.join(__dirname, "build/BE")));
app.use((req, res) => {
  res.status(404).sendFile("views/404.html", { root: __dirname });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
