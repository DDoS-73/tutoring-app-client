import { ParticipantRow } from '../../../shared/models/participant-row.model';
import { CalendarEvent } from '../../calendar/models/calendar-event.model';
import { LessonRow, LessonStatus, LessonSummary } from './lesson-row.model';

export class LessonLedger {
  public readonly rows: LessonRow[];
  public readonly summary: LessonSummary;

  constructor(events: CalendarEvent[], student: ParticipantRow | null) {
    this.rows = student ? LessonLedger.toRows(events, student) : [];
    this.summary = LessonLedger.summarize(this.rows);
  }

  private static toRows(events: CalendarEvent[], student: ParticipantRow): LessonRow[] {
    const now = new Date();
    return events
      .filter((evt) => evt.participant?.id === student.id)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .map((evt) => {
        const startTime = new Date(evt.startTime);
        const endTime = new Date(evt.endTime);
        const isPaid = evt.isPaid ?? false;
        return {
          eventId: evt.id!,
          startTime,
          endTime,
          price: isPaid ? (evt.paidAmount ?? student.pricePerClass) : student.pricePerClass,
          isPaid,
          status: LessonLedger.statusOf(isPaid, startTime < now),
          isCompleted: endTime < now,
        };
      });
  }

  private static statusOf(isPaid: boolean, isPast: boolean): LessonStatus {
    if (isPaid) return LessonStatus.Paid;
    return isPast ? LessonStatus.Loan : LessonStatus.Upcoming;
  }

  private static summarize(lessons: LessonRow[]): LessonSummary {
    const now = new Date();
    const paid = lessons.filter((l) => l.isPaid);
    const upcoming = lessons.filter((l) => l.status === LessonStatus.Upcoming);
    const loans = lessons.filter((l) => l.status === LessonStatus.Loan);
    const totalClasses = lessons.length;

    return {
      totalClasses,
      completedClasses: lessons.filter((l) => l.endTime < now).length,
      paidCount: paid.length,
      upcomingCount: upcoming.length,
      loanCount: loans.length,
      receivedAmount: LessonLedger.sumPrices(paid),
      toReceiveAmount: LessonLedger.sumPrices(upcoming),
      loanAmount: LessonLedger.sumPrices(loans),
      paidPercentage: totalClasses === 0 ? 0 : Math.round((paid.length / totalClasses) * 100),
    };
  }

  private static sumPrices(lessons: LessonRow[]): number {
    return lessons.reduce((sum, l) => sum + l.price, 0);
  }
}
