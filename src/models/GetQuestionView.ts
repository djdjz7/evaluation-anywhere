import type { QstFlow, QuestionBase } from "./QuestionBase";

export interface AnswerList {
  uuid: string;
  number: number;
  examAnswers: string[];
  examComments: string[];
  examMicroLessonComment: string;
  revisingAnswers: string[];
  revisingComments: string[];
  reviseMicroLessonComment: string;
  score: number;
  originScore?: any;
  result: number;
  originResult?: any;
  displayAnswer: number;
  whenShowAnswer: number;
  whenShowMicroLesson: number;
  examState: number;
  taskState: number;
}

export interface GetQuestionViewResult extends QuestionBase {
  attachments: string;
  qstAnswers: any[];
  analysis: string;
  microClassToQuestionList: any[];
  microClassToStudentList: any[];
  examDraft: string;
  revisingDraft: string;
  revisingResult: number;
  examAnswered: boolean;
  revisingAnswerd: boolean;
  lastRoundRevisingRecords: any[];
  typicalRightAnswers?: any;
  typicalErrorAnswers?: any;
  isInMistakeBook: boolean;
  path: string;
  itemType: number;
  qstFlows: QstFlow[];
  qstFlowsCount: number;
  totalScore: number;
  totalAnswerScore: number;
  originScore?: any;
  answerList: AnswerList[];
  microClassList?: any;
}
