export interface GenericState<T> {
  Data: T | null;
  Status: 'pending' | 'loading' | 'success' | 'failed';
  Error: string | null;
}
