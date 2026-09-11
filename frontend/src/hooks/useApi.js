import { useCallback, useEffect, useState } from "react";

// Small hand-rolled data-fetching hook — the app has ~15 real fetch call sites
// total, not enough to justify a React Query/SWR dependency. `fetcher` must be a
// stable-enough function reference for `deps`; pass the same deps you'd pass to
// useEffect/useCallback (e.g. [productId]).
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => load(), [load]);

  return { data, loading, error, refetch: load };
}
