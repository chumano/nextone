export interface GenericState<T> {
  data: T | null;
  status: 'pending' | 'loading' | 'success' | 'failed';
  error: string | null;
}
