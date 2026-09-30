import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface ApiQuery<T> {
  data: T | undefined;
  error: unknown;
  /** True only while there is no data to show yet: render a skeleton. */
  isLoading: boolean;
  /** True while any request is in flight (including background refetches). */
  isFetching: boolean;
  /** True during pull-to-refresh. */
  isRefreshing: boolean;
  /** Retry/refetch; clears a previous error so the loading state shows again. */
  refetch(): Promise<void>;
  /** Pull-to-refresh handler: refetches and shows the refresh spinner. */
  refresh(): Promise<void>;
  /** Replace cached data with a fresh server response (e.g. after a mutation). */
  setData(data: T): void;
}

interface QueryState<T> {
  key: string | null;
  data: T | undefined;
  error: unknown;
}

/**
 * Minimal data-fetching hook. `key` identifies the request: when it changes the data is refetched,
 * and responses from outdated requests are ignored so a slow request never overwrites a newer one.
 * With `keepPreviousData`, the last result stays visible while a new key loads (e.g. price quotes).
 */
export function useApiQuery<T>(key: string, fetcher: () => Promise<T>, options: { keepPreviousData?: boolean } = {}): ApiQuery<T> {
  const [state, setState] = useState<QueryState<T>>({ key: null, data: undefined, error: null });
  const [manual, setManual] = useState<'idle' | 'refetch' | 'refresh'>('idle');
  const fetcherRef = useRef(fetcher);
  const latestRequest = useRef(0);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // State is only set when the request settles, never synchronously inside the effect.
  const load = useCallback((forKey: string) => {
    const requestId = ++latestRequest.current;
    return fetcherRef.current().then(
      (data) => {
        if (requestId === latestRequest.current) setState({ key: forKey, data, error: null });
      },
      (error: unknown) => {
        if (requestId === latestRequest.current) setState((current) => ({ key: forKey, data: current.data, error }));
      },
    );
  }, []);

  useEffect(() => {
    load(key);
  }, [key, load]);

  const runManual = useCallback(
    async (mode: 'refetch' | 'refresh') => {
      setManual(mode);
      await load(key);
      setManual('idle');
    },
    [key, load],
  );
  const refetch = useCallback(() => runManual('refetch'), [runManual]);
  const refresh = useCallback(() => runManual('refresh'), [runManual]);
  const setData = useCallback((data: T) => setState({ key, data, error: null }), [key]);

  const keyChanged = state.key !== key;
  const data = keyChanged && !options.keepPreviousData ? undefined : state.data;
  const error = keyChanged || manual === 'refetch' ? null : state.error;
  const isFetching = keyChanged || manual !== 'idle';

  return {
    data,
    error,
    isLoading: isFetching && data === undefined,
    isFetching,
    isRefreshing: manual === 'refresh',
    refetch,
    refresh,
    setData,
  };
}

/** Refetches when the screen regains focus (e.g. returning from a booking), skipping the first focus. */
export function useRefetchOnFocus(refetch: () => Promise<void>) {
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );
}
