export enum StatusState {
  Pending = "Pending",
  Success = "Success",
  Failure = "Failure",
}

export enum ChallengeState {
  InProgress = "InProgress",
  Success = "Success",
  Failure = "Failure",
}

export interface Task {
  id: string;
  description: string;
}

export interface Status {
  state: StatusState;
  updated: number;
}

export interface Achievement {
  id: string;
  description: string;
  image: string;
  checkComplete: (status: Status) => Status;
}

export interface Challenge {
  id: string;
  state: ChallengeState;
  startDate: number;
  tasksOrder: Array<Task["id"]>;
  tasksStatus: Record<Task["id"], Status>;
  achievementsStatus: Record<Achievement["id"], Status>;
}

export interface ActualTask extends Task {
  status: Status;
}

export interface ArchiveItem extends ActualTask {}

export interface ActualAchievement {
  id: string;
  description: string;
  image: string;
  status: Status;
}

export interface GetCurrentTask extends Function {
  (): ActualTask;
  id: Challenge["id"];
}

export interface GetAchievements extends Function {
  (): ActualAchievement[];
  id: Challenge["id"];
}

export interface GetTaskArchive {
  (): ArchiveItem[];
  id: Challenge["id"];
}

export interface StartNewChallenge extends Function {
  (): Challenge;
  listOfTasks: Record<Task["id"], Task>;
  listOfChallenges: Record<Challenge["id"], Challenge>;
  challengeDuration: number;
  numberOfAchievements: number;
}

export interface CalculateAchievementsStatus extends Function {
  (): Record<Achievement["id"], Status>;
  achievementsList: Array<Achievement["id"]>;
  tasksStatus: Status;
}
