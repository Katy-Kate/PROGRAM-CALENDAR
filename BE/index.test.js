import {
  getCurrentTask,
  getAchievements,
  getTaskArchive,
  startNewChallenge,
  calculateAchievementsStatus,
} from "./index";

import { CHALLENGE_DURATION, NUMBER_OF_ACHIEVEMENTS } from "./utils/constants";

const dayOfChallenge = 3;
const today = new Date(new Date(1605708892710).getDate() + dayOfChallenge);
const challengeDay = new Date(1605708892710);

const getCurrentDate = () => today;
let realDate;
const listOfChallenges = {
  1: {
    id: 1,
    startDate: 1605708892710,
    taskStatus: "Pending",
    tasksOrder: ["2", "3", "1", "4"],
    tasksStatus: {
      2: {
        state: "Pending",
        updated: 1605559641866,
      },
      3: {
        state: "Pending",
        updated: 1605559641866,
      },
      1: {
        state: "Pending",
        updated: 1605559641866,
      },
      4: {
        state: "Pending",
        updated: 1605559641866,
      },
    },
    achievementsStatus: {
      1: {
        state: "Success",
        updated: 1605708892710,
      },
      2: {
        state: "Pending",
        updated: 1605708892710,
      },
      3: {
        state: "Failure",
        updated: 1605708892710,
      },
      10: {
        state: "Success",
        updated: 1605708892710,
      },
      11: {
        state: "Pending",
        updated: 1605708892710,
      },
    },
  },
  2: {
    id: 2,
    startDate: "20/01/2021",
    tasksStatus: "Pending",
    tasksOrder: ["1", "3"],
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


// test('It should create new date', () => {
//   // Setup
//   const currentDate = new Date(today);
//   realDate = Date;
//   global.Date = class extends Date {
//     constructor(date) {
//       if (date) {
//         return super(date);
//       }
//
//       return currentDate;
//     }
//   };
//
//   expect(getCurrentDate()).toEqual(new Date(today));
//
//   // Cleanup
//   global.Date = realDate;
// });


describe("getCurrentTask", () => {

   //find the way how mock Date constructor that should return now day as challengeDay prop
  test("should return a task for today", () => {
    const challengeId = "1";
    const currentTaskId = String(
      listOfChallenges[challengeId].tasksOrder[dayOfChallenge - 1],
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
      listOfChallenges,
      challengeDuration: CHALLENGE_DURATION,
      numberOfAchievements: NUMBER_OF_ACHIEVEMENTS,
    });

    expect(actual).toMatchObject({
      id: expect.any(Number),
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
  test("should return s achievements status", () => {
    const expectedLength = Object.keys(tasks).length;

    const actual = calculateAchievementsStatus({
      achievementsList,
      tasksStatus,
    });
  });
});
