export type IApiResponse<T> = ISuccessResponse<T> | IErrorResponse;

export interface IErrorItem {
  path: string;
  message?: string;
  messages?: string[];
}

export interface IErrorResponse {
  status: false;
  code: number;
  message: string;
  errors?: IErrorItem[];
}

export interface ISuccessResponse<T> {
  status: true;
  code: number;
  message?: string;
  payload?: T;
}
