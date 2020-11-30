import {
  getCurrentTask,
  getAchievements,
  getTaskArchive,
  startNewChallenge,
  calculateAchievementsStatus,
} from "./helpers";

import { CHALLENGE_DURATION, NUMBER_OF_ACHIEVEMENTS } from "./utils/constants";
import { StatusState } from "./types";

const dayOfChallenge = 4;
//find the way how mock Date constructor that should return now day as today var
// const today = Date.now();
// let challengeDay = new Date();
// challengeDay.setDate(new Date().getDate() - dayOfChallenge);
// const challengeDate = Date.parse(challengeDay);

const listOfChallenges = {
  1: {
    id: 1,
    startDate: 1606397260498,
    taskStatus: "Pending",
    tasksOrder: ["2", "3", "1", "4"],
    tasksStatus: {
      2: {
        state: "Pending",
        updated: 1606397260000,
      },
      3: {
        state: "Pending",
        updated: 1606397260000,
      },
      1: {
        state: "Pending",
        updated: 1606397260000,
      },
      4: {
        state: "Pending",
        updated: 1606397260000,
      },
    },
    achievementsStatus: {
      1: {
        state: "Success",
        updated: 1606397260000,
      },
      2: {
        state: "Pending",
        updated: 1606397260000,
      },
      3: {
        state: "Failure",
        updated: 1606397260000,
      },
      10: {
        state: "Success",
        updated: 1606397260000,
      },
      11: {
        state: "Pending",
        updated: 1606397260000,
      },
    },
  },
  2: {
    id: 2,
    startDate: 1606397260498,
    tasksStatus: "Pending",
    tasksOrder: ["1", "3", "2", "4"],
  },
};

const tasks = {
  1: {
    id: 1,
    description: "Go to bed before 11:00 PM",
  },
  2: {
    id: 2,
    description: "Take a picture of a sunset",
  },
  3: {
    id: 3,
    description: "Make a small present for your friend without a reason",
  },
  4: {
    id: 4,
    description: "Try a new cooking recipe",
  },
};

const achievements = {
  1: {
    id: 1,
    description: "Complete each task 7 days in a row",
    image: "#",
  },
  2: {
    id: 2,
    description: "Complete five tasks before 8:00 AM",
    image: "#",
  },
  3: {
    id: 3,
    description: "Complete 4 Monday's tasks",
    image: "#",
  },
  4: {
    id: 4,
    description: "Complete each task 5 days in a row",
    image: "#",
  },
  5: {
    id: 5,
    description: "Complete 3 Monday's tasks",
    image: "#",
  },
};

const defaultAchievements = {
  10: {
    id: 10,
    description: "Complete half of the tasks",
    image: "#",
  },
  11: {
    id: 11,
    description: "Complete all tasks",
    image: "#",
  },
};

jest.mock("./data/tasks.json", () => tasks);
jest.mock("./data/listOfChallenges.json", () => listOfChallenges);
jest.mock("./data/achievements.json", () => achievements);
jest.mock("./data/defaultAchievements.json", () => defaultAchievements);

describe("getCurrentTask", () => {
  test("should return a task for today", () => {
    const challengeId = "2";
    const currentTaskId = String(
      listOfChallenges[challengeId].tasksOrder[dayOfChallenge],
    );
    const expected = {
      ...tasks[currentTaskId],
      status: listOfChallenges[challengeId].tasksStatus[currentTaskId],
    };
    const actual = getCurrentTask(challengeId);
    expect(actual).toEqual(expected);
  });
});

describe("getAchievements", () => {
  const challengeId = "1";
  test("should return achievements with their statuses", () => {
    const achievementsStatus = listOfChallenges[challengeId].achievementsStatus;
    const expected = [
      {
        ...defaultAchievements["10"],
        status: achievementsStatus[defaultAchievements["10"]["id"]],
      },
      {
        ...defaultAchievements["11"],
        status: achievementsStatus[defaultAchievements["11"]["id"]],
      },
    ];

    const actual = getAchievements(challengeId);
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(NUMBER_OF_ACHIEVEMENTS);
  });
});

describe("getTaskArchive", () => {
  test("should return all past tasks with their status", () => {
    const challengeId = "1";

    const expectedList = [
      //find way mock Date
      { ...tasks["2"], status: listOfChallenges[challengeId].tasksStatus["2"] },
      { ...tasks["3"], status: listOfChallenges[challengeId].tasksStatus["3"] },
      { ...tasks["1"], status: listOfChallenges[challengeId].tasksStatus["1"] },
    ];
    const actualList = getTaskArchive(challengeId);
    expect(actualList).toEqual(expectedList);
  });
});

describe("startNewChallenge", () => {
  test("should return a new challenge", () => {
    const expectedLength = Object.keys(tasks).length;
    const actual = startNewChallenge({
      listOfTasks: tasks,
      listOfAchievements: achievements,
      challengeDuration: CHALLENGE_DURATION,
      numberOfAchievements: NUMBER_OF_ACHIEVEMENTS,
    });

    expect(actual).toMatchObject({
      id: expect.any(String),
      state: "InProgress",
      startDate: expect.any(Number),
      tasksOrder: expect.any(Array),
      tasksStatus: expect.any(Object),
      achievementsStatus: expect.any(Object),
    });
    expect(actual.tasksOrder).toHaveLength(expectedLength);
    expect(Object.keys(actual.tasksStatus)).toHaveLength(expectedLength);
    expect(Object.keys(actual.achievementsStatus)).toHaveLength(
      NUMBER_OF_ACHIEVEMENTS,
    );
  });
});

describe("calculateAchievementsStatus", () => {
  let tasksStatus;
  beforeEach(() => {
    tasksStatus = [
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
      { state: StatusState.Success, updated: 1605708892710 },
    ];
  });
  test("should return achievements status as true for default achievements", () => {
    const listOfAchievements = Object.values(defaultAchievements);
    tasksStatus[4].state = StatusState.Pending;
    tasksStatus[3].state = StatusState.Failure;
    const expectedLength = Object.keys(listOfAchievements).length;
    const actual = calculateAchievementsStatus(listOfAchievements, tasksStatus);
    const expectedStatus = true;
    expect(actual[listOfAchievements[0].id]).toBeTruthy;
    expect(actual[listOfAchievements[1].id]).toBeTruthy;
  });
  test("should return achievements status as false for default achievements", () => {
    const listOfAchievements = Object.values(defaultAchievements);
    tasksStatus[0].state = StatusState.Pending;
    tasksStatus[6].state = StatusState.Failure;
    const expectedLength = Object.keys(listOfAchievements).length;
    const actual = calculateAchievementsStatus(listOfAchievements, tasksStatus);
    const expectedStatus = true;
    expect(actual[listOfAchievements[0].id]).toBeFalsy;
    expect(actual[listOfAchievements[1].id]).toBeFalsy;
  });
});
