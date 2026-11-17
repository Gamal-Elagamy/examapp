export interface IExamDiploma {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

export interface IExam {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  duration: number;
  numberOfQuestions?: number;
  diplomaId?: string;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IExamDetails extends IExam {
  diploma?: IExamDiploma;
  questionsCount?: number;
}

export interface IExamDetailsPayload {
  exam: IExamDetails;
}
