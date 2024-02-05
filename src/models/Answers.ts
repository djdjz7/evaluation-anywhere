export interface AnswersToQstFlow {
	answers: string[];
	uuid: string;
}

export interface AnswersToQstFlowWithBlob {
	answers: Blob
	uuid: string;
}

export interface AnswersToQuestion {
	answers: AnswersToQstFlow[];
	draft: string;
	questionId: number;
}