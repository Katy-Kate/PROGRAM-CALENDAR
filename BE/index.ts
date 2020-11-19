import {
  Challenge,
  ActualAchievement,
  ChallengeState,
  Status,
  StatusState,
  Task,
  ActualTask,
  Achievement,
} from "./types";
import tasks from "./data/tasks.json";
import listOfChallenges from "./data/listOfChallenges.json";

import achievements from "./data/achievements.json";
import defaultAchievements from "./data/defaultAchievements.json";

function _shuffle(array: Array<any>) {
  const newArray = [...array];
  return newArray.sort(() => Math.random() - 0.5);
}

function _pickRandomItems(array: Array<any>, number: number) {
  const shuffledArray = _shuffle(array);
  if (shuffledArray.length > number) {
    shuffledArray.length = number;
  }
  return shuffledArray;
}

function _createNewStateFieldInObj({
  arr,
  updatedDate,
  state = StatusState["Pending"],
}: {
  arr: Array<string>;
  updatedDate: number;
  state?: StatusState;
}) {
  return arr.reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        state,
        updated: updatedDate,
      },
    };
  }, {});
}

export function getCurrentTask<GetCurrentTask>(
  challengeId: Challenge["id"],
): ActualTask | undefined {
  const challenge: Challenge = listOfChallenges[challengeId];
  try {
    const today = new Date();
    const startChallengeDay = new Date(challenge!.startDate);
    const passedCountOfDays: number =
      today.getDate() - startChallengeDay.getDate();

    const taskId: string = challenge!.tasksOrder[passedCountOfDays];
    const task: Task = tasks[taskId];
    return {
      ...task,
      status: challenge.tasksStatus[taskId],
    };
  } catch (e) {
    console.error(e);
  }
}

export function getAchievements<GetAchievements>(challengeId: Challenge["id"]) {
  const challenge: Challenge = listOfChallenges[challengeId];
  let actualAchievements: Array<ActualAchievement> = [];
  const listOfAchievements = { ...defaultAchievements, ...achievements };

  if (challenge) {
    Object.entries(challenge.achievementsStatus).map(([key, value]) => {
      actualAchievements.push({
        ...listOfAchievements[key],
        status: value,
      });
    });
  }
  return actualAchievements;
}

export function getTaskArchive<GetTaskArchive>(challengeId: Challenge["id"]) {
  const challenge: Challenge = listOfChallenges[challengeId];
  try {
    const today = new Date();
    const startChallengeDay = new Date(challenge!.startDate);
    const passedCountOfDays: number =
      today.getDate() - startChallengeDay.getDate();

    const listOfPassedTasksIds = [...challenge.tasksOrder];

    listOfPassedTasksIds.length = passedCountOfDays;

    return listOfPassedTasksIds.map(taskId => {
      return {
        ...tasks[taskId],
        status: challenge.tasksStatus[taskId],
      };
    });
  } catch (e) {
    console.error(e);
  }
}

export function startNewChallenge({
  listOfTasks,
  listOfChallenges,
  challengeDuration,
  numberOfAchievements,
}: {
  listOfTasks: Record<Task["id"], Task>;
  listOfChallenges: Record<Challenge["id"], Challenge>;
  challengeDuration: number;
  numberOfAchievements: number;
}) {
  const date = Date.now();

  const defaultAchievementsIds = Object.keys(defaultAchievements);
  const randomTasksIds = _pickRandomItems(
    Object.keys(listOfTasks),
    challengeDuration,
  );
  const randomAchievementsIds = [
    ..._pickRandomItems(
      Object.keys(achievements),
      numberOfAchievements - defaultAchievementsIds.length,
    ),
    ...defaultAchievementsIds,
  ];

  let tasksStatus: Record<Task["id"], Status> = _createNewStateFieldInObj({
    arr: randomTasksIds,
    updatedDate: date,
  });

  const achievementsStatus: Record<
    Achievement["id"],
    Status
  > = _createNewStateFieldInObj({
    arr: randomAchievementsIds,
    updatedDate: date,
  });

  const challengeId = Math.floor(date / 1000);
  const challenge = {
    id: challengeId,
    state: ChallengeState["InProgress"],
    startDate: date,
    tasksOrder: randomTasksIds,
    tasksStatus,
    achievementsStatus,
  };
  //add new challenge to the list of the challenges
  listOfChallenges[challengeId] =  challenge;

  return challenge;
}

export function calculateAchievementsStatus(
  achievementsList: Achievement[],
  tasksStatus: Status,
): Challenge["achievementsStatus"] {}
