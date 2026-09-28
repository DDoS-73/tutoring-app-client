import { ChangeDetectionStrategy, Component, computed, inject, LOCALE_ID } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ParticipantDto } from '../../../../../core/api/participant.api';
import { ParticipantService } from '../../../../../core/services/participant.service';
import { ParticipantRow } from '../../../../../shared/models/participant-row.model';
import { EventParticipantType } from '../../../../../shared/models/participant.model';
import { FormUtils, StringUtils } from '../../../../../shared/utils';
import { ParticipantModalResult } from '../../../models/participant-modal.model';
import { ParticipantForm } from '../../../forms/participant.form';
import { ParticipantFormComponent } from './participant-form/participant-form.component';

@Component({
  selector: 'app-add-participant-modal',
  templateUrl: './add-participant-modal.component.html',
  styleUrl: './add-participant-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzButtonModule, ParticipantFormComponent],
})
export class AddParticipantModalComponent {
  private readonly modalRef = inject<NzModalRef<AddParticipantModalComponent, ParticipantModalResult>>(NzModalRef);
  private readonly participantService = inject(ParticipantService);
  private readonly notification = inject(NzNotificationService);
  private readonly locale = inject(LOCALE_ID);

  protected readonly editData = inject<ParticipantRow | null>(NZ_MODAL_DATA, { optional: true });
  protected readonly isEdit = !!this.editData;

  protected readonly EventParticipantType = EventParticipantType;

  protected readonly form = new ParticipantForm(this.editData);
  private readonly formChanges = FormUtils.events(this.form);

  protected readonly isPending = computed(() =>
    this.isEdit
      ? this.participantService.updateMutation.isPending()
      : this.participantService.createMutation.isPending()
  );

  protected readonly isInvalid = computed(() => {
    this.formChanges();
    return this.form.invalid;
  });

  protected readonly showInvalidHint = computed(() => {
    this.formChanges();
    return this.form.invalid && (this.form.dirty || this.form.touched);
  });

  protected get initials(): string {
    return StringUtils.toInitials(this.form?.controls.name.value || '');
  }

  protected onClose(): void {
    if (this.isPending()) return;
    this.modalRef.close();
  }

  protected onDelete(): void {
    if (this.isPending()) return;
    this.modalRef.close({ action: 'delete' });
  }

  protected onSave(): void {
    if (this.isPending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.toDto(this.locale);
    if (this.isEdit && this.editData?.id) {
      this.saveEdit(this.editData.id, dto);
    } else {
      this.saveCreate(dto);
    }
  }

  private saveEdit(id: string | number, dto: ParticipantDto): void {
    this.participantService.updateMutation.mutate(
      { id, dto },
      {
        onSuccess: () => {
          this.notification.success('Success', 'Changes saved successfully.');
          this.modalRef.close({ updated: dto });
        },
        onError: (error) => {
          this.form.applyServerErrors(error);
          this.notification.error('Error', 'Failed to save changes. Please try again.');
        },
      }
    );
  }

  private saveCreate(dto: ParticipantDto): void {
    this.participantService.createMutation.mutate(dto, {
      onSuccess: () => {
        this.notification.success('Success', 'Participant added successfully.');
        this.modalRef.close(true);
      },
      onError: (error) => {
        this.form.applyServerErrors(error);
        this.notification.error('Error', 'Failed to add participant. Please try again.');
      },
    });
  }
}
