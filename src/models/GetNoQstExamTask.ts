export interface GetNoQstExamTaskResult {
  isRepresentative: boolean;
  myScore: number;
  groups: QuestionGroup[];
  topicId: number;
  topicName: string;
  testPagerId: number;
  testPagerName: string;
  testTips: string;
  testDescription: string;
  specificTrainingType: number;
  examId: number;
  examName: string;
  examTips: any;
  noQstStem: boolean;
  answerSheet: boolean;
  answerSheetId: number;
  address: any;
  answerPad: boolean;
  qstCount: number;
  enableScore: boolean;
  score: number;
  creationTime: string;
  startTime: string;
  endTime: any;
  studentUserId: number;
  state: number;
  examState: number;
  serialNum: any;
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

export interface QuestionGroup {
  number: number;
  name: string;
  showGroupNumber: boolean;
  description: any;
  score: number;
  myScore: number;
  qstCount: number;
  questions: Question[];
}

export interface Question {
  number: number;
  name: string;
  score: number;
  myScore: number;
  completed: boolean;
  answerWithQuestion: boolean;
  qstFlows: QstFlow[];
  answerList: AnswerList[];
  askForHelp: boolean;
  id: number;
}

export interface QstFlow {
  type: number;
  score: number;
  missScore: number;
  number: number;
  uuid: string;
  qstType: number;
  options?: string[];
  subQuestions?: SubQuestion[];
  getScore: number;
  originScore: any;
}

export interface AnswerList {
  uuid: string;
  answers: string[];
  pid: any;
}

export interface SubQuestion {
  type: number;
  score: number;
  missScore: number;
  number: number;
  uuid: string;
  qstType: number;
  options: any;
  subQuestions: any;
  getScore: number;
  originScore: any;
}
