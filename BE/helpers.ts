import {
  Achievement,
  ActualAchievement,
  ActualTask,
  Challenge,
  ChallengeState,
  Status,
  StatusState,
  Task,
} from "./types";
import listOfChallenges from "./data/listOfChallenges.json";
import tasks from "./data/tasks.json";
import defaultAchievements from "./data/defaultAchievements.json";
import achievements from "./data/achievements.json";
import { checkAchievementsComplete } from "./utils/constants";

/**  return new shuffled array.
 * @param {array} arr - array that should be shuffled
 *
 * */
function shuffle(arr: any[]) {
  const newArray = [...arr];
  return newArray.sort(() => Math.random() - 0.5);
}

/**
 * @param {array} arr - list of items that can be picked
 * @param {number} count - a number of the items that should pick from the array.
 */
function pickRandomItems(arr: Array<any>, count: number) {
  const shuffledArray = shuffle(arr);
  if (shuffledArray.length > count) {
    shuffledArray.length = count;
  }
  return shuffledArray;
}

/**
 *
 * @param arr - array of the data
 * @param updatedDate - passed today for all items
 * @param state - StatusState - can be Pending/Success/Failure, Pending - by default
 *
 * return {
 *     [id]: { state:StatusState, updated: updatedDate }
 *     ...}
 */
function createNewStatusState({
  arr,
  updatedDate,
  state = StatusState.Pending,
}: {
  arr: Array<string>;
  updatedDate: number;
  state?: StatusState;
}) {
  return arr.reduce(
    (acc, id) => ({ ...acc, [id]: { state, updated: updatedDate } }),
    {},
  );
}

/**
 *
 * @param challengeId - id of the current challenge
 */
export function getCurrentTask(challengeId: Challenge["id"]): ActualTask {
  const challenge: Challenge = (<any>listOfChallenges)[challengeId];
  const today = new Date();
  const startChallengeDay = new Date(challenge!.startDate);
  const passedCountOfDays: number =
    today.getDate() - startChallengeDay.getDate();

  const taskId: string = String(challenge!.tasksOrder[passedCountOfDays]);
  const task: Task = (<any>tasks)[taskId];
  return {
    ...task,
    status: challenge.tasksStatus[taskId],
  };
}

/**
 *
 * @param challengeId - id of the current challenge
 */
export function getAchievements(challengeId: Challenge["id"]) {
  const challenge: Challenge = (<any>listOfChallenges)[challengeId];
  const actualAchievements: Array<ActualAchievement> = [];
  const listOfAchievements = { ...defaultAchievements, ...achievements };

  if (challenge) {
    Object.entries(challenge.achievementsStatus).forEach(([key, value]) => {
      actualAchievements.push({
        ...(<any>listOfAchievements)[key],
        status: value,
      });
    });
  }
  return actualAchievements;
}

/**
 *
 * @param challengeId - id of the current challenge
 */
export function getTaskArchive(challengeId: Challenge["id"]) {
  const challenge: Challenge = (<any>listOfChallenges)[challengeId];
  const today = new Date();
  const startChallengeDay = new Date(challenge!.startDate);
  const passedCountOfDays: number =
    today.getDate() - startChallengeDay.getDate();

  const listOfPassedTasksIds = [...challenge.tasksOrder];

  listOfPassedTasksIds.length = passedCountOfDays - 1;

  return listOfPassedTasksIds.map(taskId => ({
    ...(<any>tasks)[taskId],
    status: challenge.tasksStatus[taskId],
  }));
}

/**
 *
 * @param listOfTasks - all tasks
 * @param listOfAchievements - list of all achievements without default
 * @param challengeDuration - how much days a challenge should be
 * @param numberOfAchievements - number how much achievements should be in the challenge
 */
export function startNewChallenge({
  listOfTasks,
  listOfAchievements,
  challengeDuration,
  numberOfAchievements,
}: {
  listOfTasks: Record<Task["id"], Task>;
  listOfAchievements: Record<Achievement["id"], Achievement>;
  challengeDuration: number;
  numberOfAchievements: number;
}) {
  const date = Date.now();

  const defaultAchievementsIds = Object.keys(defaultAchievements);
  const randomTasksIds = pickRandomItems(
    Object.keys(listOfTasks),
    challengeDuration,
  );
  const randomAchievementsIds = [
    ...pickRandomItems(
      Object.keys(listOfAchievements),
      numberOfAchievements - defaultAchievementsIds.length,
    ),
    ...defaultAchievementsIds,
  ];

  const tasksStatus: Record<Task["id"], Status> = createNewStatusState({
    arr: randomTasksIds,
    updatedDate: date,
  });

  const achievementsStatus = createNewStatusState({
    arr: randomAchievementsIds,
    updatedDate: date,
  });

  const challengeId = String(Math.floor(date / 1000));
  return {
    id: challengeId,
    state: ChallengeState.InProgress,
    startDate: date,
    tasksOrder: randomTasksIds,
    tasksStatus,
    achievementsStatus,
  };
}

/**
 *
 * @param listOfAchievements - all achievements in the current challenge
 * @param tasksStatus  - array of the tasks status in order that should be completed
 */
export function calculateAchievementsStatus(
  listOfAchievements: Achievement[],
  tasksStatus: Status[],
): { [id: string]: { state: any; updated: number } }[] {
  return listOfAchievements.map(({ id }) => {
    const stateStatus = (<any>checkAchievementsComplete)[id](tasksStatus);
    return {
      [id]: {
        state: stateStatus,
        updated: Date.now(),
      },
    };
  });
}
