export function cachedForever() {
  return {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  } as const;
}

export function cachedForeverRefetchOnMount() {
  return {
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  } as const;
}
