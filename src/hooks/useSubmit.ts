import { useCallback, useRef, useState } from 'react';

export type SubmitResult<T> = { ok: true; value: T } | { ok: false };

/**
 * Tracks one form submission / mutation. `submit` never throws: it resolves to `{ ok: true }`
 * only when the backend succeeded (the error is kept in `error` otherwise), so callers only
 * navigate or show a success state after a real success. Repeated taps while pending are ignored.
 */
export function useSubmit<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const pending = useRef(false);

  const submit = useCallback(
    async (...args: Args): Promise<SubmitResult<Result>> => {
      if (pending.current) return { ok: false };
      pending.current = true;
      setIsSubmitting(true);
      setError(null);
      try {
        return { ok: true, value: await action(...args) };
      } catch (caught) {
        setError(caught);
        return { ok: false };
      } finally {
        pending.current = false;
        setIsSubmitting(false);
      }
    },
    [action],
  );

  const reset = useCallback(() => setError(null), []);

  return { submit, isSubmitting, error, reset };
}
