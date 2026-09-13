import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { QueryKeys } from '../../../../../core/api/query-keys';
import { cachedForeverRefetchOnMount } from '../../../../../core/api/query-options';
import { DEFAULT_PARTICIPANT_PRICE } from '../../../../../shared/models/participant.model';
import { ParticipantDetailService } from '../participant-detail/participant-detail.service';
import { PaymentsService } from './payments.service';

export interface LessonRow {
  eventId: string | number;
  startTime: Date;
  endTime: Date;
  price: number;
  isPaid: boolean;
  status: 'Paid' | 'Loan' | 'Upcoming';
  isCompleted: boolean;
}

@Component({
  selector: 'app-participant-payments',
  templateUrl: './participant-payments.component.html',
  styleUrl: './participant-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzSpinModule, DatePipe],
})
export class ParticipantPaymentsComponent {
  private readonly participantDetail = inject(ParticipantDetailService);
  protected readonly paymentsService = inject(PaymentsService);
  private readonly notification = inject(NzNotificationService);

  protected readonly participant = this.participantDetail.participant;

  protected readonly selectedDate = signal<Date>(new Date());

  protected readonly monthRange = computed(() => {
    const date = this.selectedDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    // Start of the month in local time midnight
    const from = new Date(year, month, 1, 0, 0, 0, 0);
    // End of the month in local time end of day
    const to = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
    };
  });

  protected readonly monthLabel = computed(() => {
    const date = this.selectedDate();
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  protected readonly eventsQuery = injectQuery(() => {
    const { from, to } = this.monthRange();
    return {
      queryKey: QueryKeys.events.month(from, to),
      queryFn: () => this.paymentsService.getEventsForRange(from, to),
      ...cachedForeverRefetchOnMount(),
    };
  });

  protected readonly isDataLoading = computed(() => this.eventsQuery.isFetching());

  protected readonly studentLessons = computed<LessonRow[]>(() => {
    const student = this.participant();
    if (!student) return [];

    const events = this.eventsQuery.data() ?? [];

    // Filter events for this student
    const studentEvents = events.filter((evt) => evt.participant?.id === student.id);

    // Sort by startTime
    const sorted = [...studentEvents].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const now = new Date();

    return sorted.map((evt) => {
      const occurrenceTime = new Date(evt.startTime);
      const isPast = occurrenceTime < now;
      const isPaid = evt.isPaid ?? false;
      const endTime = new Date(evt.endTime);
      const isCompleted = endTime < now;

      let status: 'Paid' | 'Loan' | 'Upcoming';
      if (isPaid) {
        status = 'Paid';
      } else if (isPast) {
        status = 'Loan';
      } else {
        status = 'Upcoming';
      }

      // Use snapshotted paidAmount if available/paid, otherwise student rate (default if undefined)
      const price = isPaid
        ? (evt.paidAmount ?? student.price ?? DEFAULT_PARTICIPANT_PRICE)
        : (student.price ?? DEFAULT_PARTICIPANT_PRICE);

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
  });

  // Financial Metrics
  protected readonly totalClasses = computed(() => this.studentLessons().length);

  protected readonly completedClasses = computed(() => {
    const now = new Date();
    return this.studentLessons().filter((l) => l.endTime < now).length;
  });

  protected readonly paidCount = computed(() => this.studentLessons().filter((l) => l.isPaid).length);

  protected readonly upcomingCount = computed(
    () => this.studentLessons().filter((l) => l.status === 'Upcoming').length
  );

  protected readonly loanCount = computed(() => this.studentLessons().filter((l) => l.status === 'Loan').length);

  protected readonly receivedAmount = computed(() =>
    this.studentLessons()
      .filter((l) => l.isPaid)
      .reduce((sum, l) => sum + l.price, 0)
  );

  protected readonly toReceiveAmount = computed(() =>
    this.studentLessons()
      .filter((l) => l.status === 'Upcoming')
      .reduce((sum, l) => sum + l.price, 0)
  );

  protected readonly loanAmount = computed(() =>
    this.studentLessons()
      .filter((l) => l.status === 'Loan')
      .reduce((sum, l) => sum + l.price, 0)
  );

  protected readonly pendingEventId = computed(() => {
    const mutation = this.paymentsService.updateStatusMutation;
    return mutation.isPending() ? mutation.variables()?.eventId : undefined;
  });

  protected readonly paidPercentage = computed(() => {
    const total = this.totalClasses();
    if (total === 0) return 0;
    return Math.round((this.paidCount() / total) * 100);
  });

  protected prevMonth(): void {
    const current = this.selectedDate();
    const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.selectedDate.set(prev);
  }

  protected nextMonth(): void {
    const current = this.selectedDate();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.selectedDate.set(next);
  }

  protected onTogglePaid(lesson: LessonRow): void {
    const student = this.participant();
    if (!student || student.id == null) return;

    const body = {
      studentId: student.id,
      eventId: lesson.eventId,
      date: lesson.startTime.toISOString(),
      isPaid: !lesson.isPaid,
    };

    this.paymentsService.updateStatusMutation.mutate(body, {
      onError: () => {
        this.notification.error('Error', 'Failed to update payment status.');
      },
    });
  }
}
