import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ParticipantService } from '../../../../../core/services/participant.service';
import { EventParticipantType, Participant } from '../../../../../shared/models/participant.model';
import { toInitials } from '../../../../../shared/utils';

@Component({
  selector: 'app-add-participant-modal',
  templateUrl: './add-participant-modal.component.html',
  styleUrl: './add-participant-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzIconModule, NzButtonModule],
})
export class AddParticipantModalComponent {
  private readonly modalRef = inject(NzModalRef);
  private readonly participantService = inject(ParticipantService);
  private readonly notification = inject(NzNotificationService);

  protected readonly editData = inject<Participant | null>(NZ_MODAL_DATA, { optional: true });
  protected readonly isEdit = !!this.editData;

  protected readonly EventParticipantType = EventParticipantType;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: [this.editData?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
    type: [this.editData?.type ?? EventParticipantType.Student, [Validators.required]],
    price: [this.editData?.price ?? 400, [Validators.required, Validators.min(0)]],
  });

  protected readonly isPending = computed(() =>
    this.isEdit
      ? this.participantService.updateMutation.isPending()
      : this.participantService.createMutation.isPending()
  );

  protected get initials(): string {
    return toInitials(this.form?.get('name')?.value || '');
  }

  protected setType(type: EventParticipantType): void {
    if (this.isPending()) return;
    this.form.patchValue({ type });
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

    const value = this.form.getRawValue();
    if (this.isEdit && this.editData?.id) {
      this.participantService.updateMutation.mutate(
        {
          id: this.editData.id,
          dto: value,
        },
        {
          onSuccess: () => {
            this.notification.success('Success', 'Changes saved successfully.');
            this.modalRef.close({ updated: value });
          },
          onError: () => {
            this.notification.error('Error', 'Failed to save changes. Please try again.');
          },
        }
      );
    } else {
      this.participantService.createMutation.mutate(value, {
        onSuccess: () => {
          this.notification.success('Success', 'Participant added successfully.');
          this.modalRef.close(true);
        },
        onError: () => {
          this.notification.error('Error', 'Failed to add participant. Please try again.');
        },
      });
    }
  }
}
