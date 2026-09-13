import { CalendarEvent } from '../../calendar/models/calendar-event.model';
import { Participant } from '../../../shared/models/participant.model';
import { resolvePrice } from '../../../shared/models/participant-row.model';
import { LessonRow, LessonStatus, LessonSummary } from '../models/lesson-row.model';

export function toLessonRows(events: CalendarEvent[], student: Participant): LessonRow[] {
  const studentEvents = events.filter((evt) => evt.participant?.id === student.id);
  const sorted = [...studentEvents].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const now = new Date();

  return sorted.map((evt) => {
    const occurrenceTime = new Date(evt.startTime);
    const isPast = occurrenceTime < now;
    const isPaid = evt.isPaid ?? false;
    const endTime = new Date(evt.endTime);
    const isCompleted = endTime < now;

    let status: LessonStatus;
    if (isPaid) {
      status = LessonStatus.Paid;
    } else if (isPast) {
      status = LessonStatus.Loan;
    } else {
      status = LessonStatus.Upcoming;
    }

    const price = isPaid ? (evt.paidAmount ?? resolvePrice(student)) : resolvePrice(student);

    return {
      eventId: evt.id!,
      startTime: occurrenceTime,
      endTime,
      price,
      isPaid,
      status,
      isCompleted,
    };
  });
}

export function summarizeLessons(lessons: LessonRow[]): LessonSummary {
  const now = new Date();

  const totalClasses = lessons.length;
  const paidCount = lessons.filter((l) => l.isPaid).length;

  return {
    totalClasses,
    completedClasses: lessons.filter((l) => l.endTime < now).length,
    paidCount,
    upcomingCount: lessons.filter((l) => l.status === LessonStatus.Upcoming).length,
    loanCount: lessons.filter((l) => l.status === LessonStatus.Loan).length,
    receivedAmount: lessons.filter((l) => l.isPaid).reduce((sum, l) => sum + l.price, 0),
    toReceiveAmount: lessons.filter((l) => l.status === LessonStatus.Upcoming).reduce((sum, l) => sum + l.price, 0),
    loanAmount: lessons.filter((l) => l.status === LessonStatus.Loan).reduce((sum, l) => sum + l.price, 0),
    paidPercentage: totalClasses === 0 ? 0 : Math.round((paidCount / totalClasses) * 100),
  };
}
