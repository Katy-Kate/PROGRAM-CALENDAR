import express from "express";

import listOfTasks from "../data/tasks.json";
import listOfAchievements from "../data/achievements.json";
import {
  startNewChallenge,
  getCurrentTask,
  getAchievements,
  getTaskArchive,
} from "../helpers";
import { NUMBER_OF_ACHIEVEMENTS, CHALLENGE_DURATION } from "../utils/constants";

export const challengeRouter = express.Router();

const listOfChallenges = [];

challengeRouter.get("/startNewChallenge", (req, res) => {
  const challenge = startNewChallenge({
    listOfTasks,
    listOfAchievements,
    challengeDuration: CHALLENGE_DURATION,
    numberOfAchievements: NUMBER_OF_ACHIEVEMENTS,
  });
  listOfChallenges.push(challenge);
  res.status(200).json(challenge.id);
});
challengeRouter.get("/:id/currentTask", (req, res) => {
  const challengeId = req.params.id;
  const currentTask = getCurrentTask(challengeId);
  res.status(200).json(currentTask);
});
challengeRouter.get("/:id/achievements", (req, res) => {
  const challengeId = req.params.id;
  const achievements = getAchievements(challengeId);
  res.status(200).json(achievements);
});
challengeRouter.get("/:id/taskArchive", (req, res) => {
  const challengeId = req.params.id;
  const taskArchive = getTaskArchive(challengeId);
  res.status(200).json(taskArchive);
});
