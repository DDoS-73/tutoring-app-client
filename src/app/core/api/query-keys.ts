export const QueryKeys = {
  participants: {
    all: () => ['participants'] as const,
    active: () => ['participants', 'active'] as const,
    archived: () => ['participants', 'archived'] as const,
  },
  customFieldValues: {
    all: () => ['custom-field-values'] as const,
    byParticipant: (id: string | number) => ['custom-field-values', String(id)] as const,
  },
  events: {
    all: () => ['events'] as const,
    month: (from: string, to: string) => ['events', 'month', from, to] as const,
  },
} as const;
