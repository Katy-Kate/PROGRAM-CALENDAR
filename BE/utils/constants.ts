import { Status, StatusState } from "../types";

export const CHALLENGE_DURATION = 30;
export const NUMBER_OF_ACHIEVEMENTS = CHALLENGE_DURATION / 6;

export const checkAchievementsComplete = {
  1: function checkAchievementsComplete(tasksStatus: Status[]) {
    const completedTasks = tasksStatus.reduce((acc, status) => {
      if (acc > 6) {
        return acc;
      }
      return status.state === StatusState.Success ? acc + 1 : 0;
    }, 0);
    return completedTasks > 6;
  },

  2: function checkAchievementsComplete(tasksStatus: Status[]) {
    const completedTasks = tasksStatus.reduce((acc, status) => {
      const hours = new Date(status.updated).getHours();
      if (status.state === StatusState.Success && hours < 8) {
        return acc + 1;
      }
      return 0;
    }, 0);

    return completedTasks > 4;
  },

  3: function checkAchievementsComplete(tasksStatus: Status[]) {
    const completedTasks = tasksStatus.reduce((acc, status) => {
      const weekDay = new Date(status.updated).getDay();
      if (status.state === StatusState.Success && weekDay === 1) {
        return acc + 1;
      }
      return 0;
    }, 0);

    return completedTasks > 3;
  },

  4: function checkAchievementsComplete(tasksStatus: Status[]) {
    const completedTasks = tasksStatus.reduce((acc, status) => {
      if (acc > 5) {
        return acc;
      }
      return status.state === StatusState.Success ? acc + 1 : 0;
    }, 0);
    return completedTasks > 4;
  },

  5: function checkAchievementsComplete(tasksStatus: Status[]) {
    const completedTasks = tasksStatus.reduce((acc, status) => {
      const weekDay = new Date(status.updated).getDay();
      if (status.state === StatusState.Success && weekDay === 5) {
        return acc + 1;
      }
      return 0;
    }, 0);

    return completedTasks > 3;
  },

  10: function checkAchievementsComplete(tasksStatus: Status[]) {
    const completedTasks = tasksStatus.reduce((acc, status) => {
      if (status.state === StatusState.Success) {
        return acc + 1;
      }
      return 0;
    }, 0);
    return completedTasks > (tasksStatus.length - 1) / 2;
  },

  11: function checkAchievementsComplete(tasksStatus: Status[]) {
    return tasksStatus.every(status => status.state === StatusState.Success);
  },
};
