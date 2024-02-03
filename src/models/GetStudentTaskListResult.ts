export interface Exam {
  examTaskId: number
  topicId: number
  topicName: string
  examId: number
  examName: string
  examState: number
  creationTime: string
  startTime: string
  endTime?: string
  taskState: number
  correctWithSelf: boolean
  correctOnline: boolean
  isExempted: boolean
  isNoStem: boolean
  answeringUrge: number
  revisingUrge: number
  isCollect: boolean
  answerSheet: boolean
  answerPad: boolean
  correctOnlineState: number
  specificTrainingType: number
  size: number
  testPagerId: number
  address?: string
  serialNum: string
  isRead?: boolean
}

export interface GetStudentTaskListResult {
  totalCount: number;
  items: Exam[];
}
