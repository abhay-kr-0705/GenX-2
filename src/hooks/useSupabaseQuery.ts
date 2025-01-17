import { withRetry } from '../utils/networkUtils';
// ... existing imports ...

export function useSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: any[] = []
): UseSupabaseQueryResult<T> {
  // ... existing code ...

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await withRetry(() => query());
      
      if (error) throw error;
      setData(data);
      setError(null);
    } catch (err) {
      setError(err);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the code remains the same ...
}