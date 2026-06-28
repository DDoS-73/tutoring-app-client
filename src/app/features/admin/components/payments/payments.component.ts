import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ParticipantService } from '../../../../core/services/participant.service';
import { ParticipantRow, toParticipantRows } from '../../../../shared/models/participant-row.model';
import { EventParticipantType } from '../../../../shared/models/participant.model';
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
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzSpinModule, FormsModule, NgTemplateOutlet, DatePipe],
})
export class PaymentsComponent {
  private readonly participantService = inject(ParticipantService);
  protected readonly paymentsService = inject(PaymentsService);
  private readonly notification = inject(NzNotificationService);

  protected readonly activeQuery = this.participantService.participantsQuery;
  protected readonly searchQuery = signal('');
  protected readonly selectedStudent = signal<ParticipantRow | null>(null);
  protected readonly selectedDate = signal<Date>(new Date());

  protected readonly activeRows = computed(() => toParticipantRows(this.activeQuery.data() ?? []));

  protected readonly filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const rows = this.activeRows();
    const students = rows.filter(
      (r) => r.type === EventParticipantType.Student || r.type === undefined || r.type === null
    );
    if (!query) return students;
    return students.filter((r) => r.name.toLowerCase().includes(query));
  });

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
      queryKey: ['events', from, to],
      queryFn: () => this.paymentsService.getEventsForRange(from, to),
      staleTime: 0,
      // Keep cached event data indefinitely to avoid re-fetching when switching months back and forth within the same session
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
    };
  });

  protected readonly isDataLoading = computed(() => this.eventsQuery.isFetching());

  protected readonly studentLessons = computed<LessonRow[]>(() => {
    const student = this.selectedStudent();
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

      // Use snapshotted paidAmount if available/paid, otherwise student rate (default to 400 if undefined)
      const price = isPaid ? (evt.paidAmount ?? student.price ?? 400) : (student.price ?? 400);

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

  protected readonly paidPercentage = computed(() => {
    const total = this.totalClasses();
    if (total === 0) return 0;
    return Math.round((this.paidCount() / total) * 100);
  });

  protected selectStudent(p: ParticipantRow): void {
    this.selectedStudent.set(p);
  }

  protected clearSelection(): void {
    this.selectedStudent.set(null);
  }

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
    const student = this.selectedStudent();
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
