export enum StatusState {
  Pending = 0,
  Success = 1,
  Failure = 2,
}

export enum ChallengeState {
  InProgress = 0,
  Success = 1,
  Failure = 2,
}

// interfaces for main instances that will be used in the future app
export interface Task {
  id: number;
  description: string;
}

export interface Status {
  state: StatusState;
  updated: Date;
}

export interface Achievement {
  id: number;
  description: string;
  image: string;
  checkComplete: (status: Status) => Status;
}

export interface Challenge {
  id: number;
  state: ChallengeState;
  startDate: Date;
  taskOrder: Task[];
  taskStatus: Status;
  achievementsStatus: Status;
}

export interface AchieveItem extends Task {
  status: Status;
}

export interface ActualTask extends Task {
  status: Status;
}

export interface ActualAchievement extends ActualTask {
  image: string;
}

// types of the future functions:
export interface GetCurrentTaskFunc extends Function {
  (): Task;
  id: Challenge["id"];
}

export interface GetAchievements extends Function {
  (): ActualAchievement[];
  id: Challenge["id"];
}

export interface GetTaskArchive {
  (): Task[];
  id: Challenge["id"];
}

export interface StartNewChallenge extends Function {
  (): Challenge;
  listOfTask: Array<Task>;
  listOfChallenge: Array<Challenge>;
  challengeDuration: number;
  numberOfAchievements: number;
}

export interface CalculateAchievementsStatus extends Function {
  (): Challenge["achievementsStatus"];
  achievementsList: Achievement[];
  tasksStatus: Status;
}
