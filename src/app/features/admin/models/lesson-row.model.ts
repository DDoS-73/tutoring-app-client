export const LessonStatus = {
  Paid: 'Paid',
  Loan: 'Loan',
  Upcoming: 'Upcoming',
} as const;

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus];

export interface LessonRow {
  eventId: string | number;
  startTime: Date;
  endTime: Date;
  price: number;
  isPaid: boolean;
  status: LessonStatus;
  isCompleted: boolean;
}

export interface LessonSummary {
  totalClasses: number;
  completedClasses: number;
  paidCount: number;
  upcomingCount: number;
  loanCount: number;
  receivedAmount: number;
  toReceiveAmount: number;
  loanAmount: number;
  paidPercentage: number;
}
