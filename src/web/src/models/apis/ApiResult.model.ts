export interface ApiResult<T> {
  IsSuccess: boolean;
  Data: T;
  ErrorMessage: string;
}
