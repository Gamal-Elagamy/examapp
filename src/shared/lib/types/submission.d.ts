export interface ISubmissionAnswerInput {
  questionId: string;
  answerId: string;
}

export interface ICreateSubmissionInput {
  examId: string;
  answers: ISubmissionAnswerInput[];
  startedAt: string;
}

export interface ISubmissionAnswerDetail {
  id?: string;
  text?: string;
}

export interface ISubmissionAnalytics {
  questionId: string;
  questionText: string;
  selectedAnswer?: ISubmissionAnswerDetail | null;
  isCorrect: boolean;
  correctAnswer?: ISubmissionAnswerDetail | null;
}

export interface ISubmissionExam {
  id: string;
  title: string;
  duration?: number;
}

export interface ISubmission {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  exam?: ISubmissionExam;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubmissionDetailsPayload {
  submission: ISubmission;
  analytics: ISubmissionAnalytics[];
}

export interface ISubmissionsListPayload {
  data: ISubmission[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetSubmissionsParams {
  examId?: string;
  page?: number;
  limit?: number;
  search?: string;
}
