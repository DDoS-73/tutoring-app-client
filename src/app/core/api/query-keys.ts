export const QueryKeys = {
  participants: {
    all: () => ['participants'] as const,
    active: () => ['participants', 'active'] as const,
    archived: () => ['participants', 'archived'] as const,
  },
  events: {
    all: () => ['events'] as const,
    month: (from: string, to: string) => ['events', 'month', from, to] as const,
  },
} as const;
