export interface Question {
  id: number;
  relatedGroupId?: any;
  number: number;
  name?: string;
  score: number;
  myScore: number;
  itemType: number;
  completed: boolean;
  hasMicroClass: boolean;
  state: number;
  askForHelp: boolean;
  revisingResult: number;
  originScore?: any;
}

export interface QuestionGroup {
  number: number;
  name: string;
  showGroupNumber: boolean;
  description?: any;
  score: number;
  myScore: number;
  qstCount: number;
  questions: Question[];
}

export interface GetExamTaskResult {
  isRepresentative: boolean;
  myScore: number;
  groups: QuestionGroup[];
  topicId: number;
  topicName: string;
  testPagerId: number;
  testPagerName: string;
  testTips?: any;
  testDescription?: any;
  specificTrainingType: number;
  examId: number;
  examName: string;
  examTips?: any;
  noQstStem: boolean;
  answerSheet: boolean;
  answerSheetId?: any;
  address?: any;
  answerPad: boolean;
  qstCount: number;
  enableScore: boolean;
  score: number;
  creationTime: string;
  startTime: string;
  endTime?: any;
  studentUserId: number;
  state: number;
  examState: number;
  serialNum?: any;
  correctWithSelf: boolean;
  correctOnline: boolean;
  displayAnswer: number;
  whenShowAnswer: number;
  whenShowMicroLesson: number;
  isExempted: boolean;
  answeringUrge: number;
  revisingUrge: number;
  teacherUserId: number;
  correctOnlineState: number;
  size: number;
  gradeId: number;
  gradeName: string;
  isRead: boolean;
  id: number;
}
