import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LessonRow } from '../../../models/lesson-row.model';
import { PaymentsService } from '../../../services/payments.service';
import { toLessonRows, summarizeLessons } from '../../../utils/lesson-ledger';
import { formatMonthLabel, monthRangeIso, shiftMonth } from '../../../utils/month-range.util';
import { ParticipantDetailService } from '../participant-detail/participant-detail.service';

@Component({
  selector: 'app-participant-payments',
  templateUrl: './participant-payments.component.html',
  styleUrl: './participant-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzSpinModule, DatePipe],
})
export class ParticipantPaymentsComponent {
  private readonly participantDetail = inject(ParticipantDetailService);
  private readonly paymentsService = inject(PaymentsService);
  private readonly notification = inject(NzNotificationService);

  protected readonly participant = this.participantDetail.participant;

  private readonly selectedDate = signal<Date>(new Date());
  private readonly monthRange = computed(() => monthRangeIso(this.selectedDate()));
  private readonly eventsQuery = this.paymentsService.createEventsQuery(this.monthRange);

  protected readonly monthLabel = computed(() => formatMonthLabel(this.selectedDate()));
  protected readonly isDataLoading = computed(() => this.eventsQuery.isFetching());

  protected readonly studentLessons = computed<LessonRow[]>(() => {
    const student = this.participant();
    if (!student) return [];
    return toLessonRows(this.eventsQuery.data() ?? [], student);
  });

  protected readonly summary = computed(() => summarizeLessons(this.studentLessons()));

  protected readonly pendingEventId = computed(() => {
    const mutation = this.paymentsService.updateStatusMutation;
    return mutation.isPending() ? mutation.variables()?.eventId : undefined;
  });

  protected prevMonth(): void {
    this.selectedDate.set(shiftMonth(this.selectedDate(), -1));
  }

  protected nextMonth(): void {
    this.selectedDate.set(shiftMonth(this.selectedDate(), 1));
  }

  protected onTogglePaid(lesson: LessonRow): void {
    const student = this.participant();
    if (!student || student.id == null) return;

    this.paymentsService.updateStatusMutation.mutate(
      {
        studentId: student.id,
        eventId: lesson.eventId,
        date: lesson.startTime.toISOString(),
        isPaid: !lesson.isPaid,
      },
      {
        onError: () => {
          this.notification.error('Error', 'Failed to update payment status.');
        },
      }
    );
  }
}
