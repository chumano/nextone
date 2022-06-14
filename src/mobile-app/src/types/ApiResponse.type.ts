export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  errorMessage: string | null;
}
