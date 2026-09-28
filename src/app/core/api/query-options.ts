export class QueryOptions {
  public static cachedForever() {
    return {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    } as const;
  }

  public static cachedForeverRefetchOnMount() {
    return {
      staleTime: 0,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
    } as const;
  }
}
