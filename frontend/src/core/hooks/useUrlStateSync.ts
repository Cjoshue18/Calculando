import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Synchronizes tool form state with URL search query params
 * Enables instant sharing via WhatsApp/URL
 */
export function useUrlStateSync<T extends Record<string, unknown>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state encoded as JSON in 'q' or separate params
  const getInitialState = useCallback((): Partial<T> | null => {
    try {
      const encoded = searchParams.get('q');
      if (encoded) {
        const decoded = decodeURIComponent(atob(encoded));
        return JSON.parse(decoded) as Partial<T>;
      }
    } catch {
      // Fallback
    }
    return null;
  }, [searchParams]);

  // Sync state into URL query param
  const syncStateToUrl = useCallback((state: T) => {
    try {
      const json = JSON.stringify(state);
      const encoded = btoa(encodeURIComponent(json));
      setSearchParams({ q: encoded }, { replace: true });
    } catch {
      // Ignore
    }
  }, [setSearchParams]);

  const getShareableUrl = useCallback((state: T): string => {
    try {
      const json = JSON.stringify(state);
      const encoded = btoa(encodeURIComponent(json));
      const url = new URL(window.location.href);
      url.searchParams.set('q', encoded);
      return url.toString();
    } catch {
      return window.location.href;
    }
  }, []);

  return { getInitialState, syncStateToUrl, getShareableUrl };
}
