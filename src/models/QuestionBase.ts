export interface QuestionBase {
  number: number;
  name?: string;
  score: number;
  answerWithQuestion: boolean;
  qstFlows: QstFlow[];
  id: number;
  askForHelp: boolean;
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
