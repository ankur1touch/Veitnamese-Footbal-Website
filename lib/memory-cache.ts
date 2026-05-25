/**
 * In-memory TTL cache with in-flight deduplication.
 * Avoids Next.js unstable_cache file corruption seen during parallel dev compiles.
 */
export function createTimedCache<T>(ttlMs: number) {
  let entry: { value: T; expiresAt: number } | null = null;
  let inflight: Promise<T> | null = null;

  function getCached(fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (entry && entry.expiresAt > now) {
      return Promise.resolve(entry.value);
    }

    if (inflight) return inflight;

    inflight = fetcher()
      .then((value) => {
        entry = { value, expiresAt: Date.now() + ttlMs };
        inflight = null;
        return value;
      })
      .catch((err) => {
        inflight = null;
        throw err;
      });

    return inflight;
  }

  function setCached(value: T): void {
    entry = { value, expiresAt: Date.now() + ttlMs };
  }

  return Object.assign(getCached, { setCached });
}
