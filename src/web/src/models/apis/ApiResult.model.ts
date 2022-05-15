export interface ApiResult<T> {
  isSuccess: boolean;
  data: T;
  errorMessage: string;
}
