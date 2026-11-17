export type IApiResponse<T> = ISuccessResponse<T> | IErrorResponse;

export interface IErrorResponse {
  status: false;
  code: number;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export interface ISuccessResponse<T> {
  status: true;
  code: number;
  message?: string;
  payload?: T;
}
