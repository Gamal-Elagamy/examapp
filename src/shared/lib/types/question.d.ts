export interface IAnswer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface IQuestionExam {
  id: string;
  title: string;
  duration?: number;
  numberOfQuestions?: number;
}

export interface IQuestion {
  id: string;
  text: string;
  examId: string;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  answers: IAnswer[];
  exam?: IQuestionExam;
}

export interface IExamQuestionsPayload {
  questions: IQuestion[];
}

export interface GetExamQuestionsParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  immutable?: boolean;
  search?: string;
}
