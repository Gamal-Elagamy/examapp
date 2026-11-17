import type { IExam } from "./exam";

export interface IDiploma {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable?: boolean;
  createdAt: string;
  updatedAt?: string;
  exams?: IExam[];
}

export interface IDiplomasPayload {
  data: IDiploma[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IDiplomaDetailsPayload {
  diploma: IDiploma;
}
