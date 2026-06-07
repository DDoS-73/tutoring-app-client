import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
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
export class AddParticipantModalComponent implements OnInit {
  private readonly modalRef = inject(NzModalRef);
  private readonly fb = inject(FormBuilder);
  private readonly participantService = inject(ParticipantService);
  private readonly message = inject(NzMessageService);

  protected readonly editData = inject<Participant | null>(NZ_MODAL_DATA, { optional: true });
  protected readonly isEdit = !!this.editData;

  protected readonly EventParticipantType = EventParticipantType;
  protected form!: FormGroup;

  protected get isPending(): boolean {
    return this.isEdit
      ? this.participantService.updateMutation.isPending()
      : this.participantService.createMutation.isPending();
  }

  protected get initials(): string {
    return toInitials(this.form?.get('name')?.value || '');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.editData?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      type: [this.editData?.type ?? EventParticipantType.Student, [Validators.required]],
      price: [this.editData?.price ?? 400, [Validators.required, Validators.min(0)]],
    });
  }

  protected setType(type: EventParticipantType): void {
    if (this.isPending) return;
    this.form.patchValue({ type });
  }

  protected onClose(): void {
    if (this.isPending) return;
    this.modalRef.close();
  }

  protected onDelete(): void {
    if (this.isPending) return;
    this.modalRef.close({ action: 'delete' });
  }

  protected onSave(): void {
    if (this.isPending) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    if (this.isEdit && this.editData?.id) {
      this.participantService.updateMutation.mutate(
        {
          id: this.editData.id,
          dto: value,
        },
        {
          onSuccess: () => {
            this.message.success('Зміни успішно збережено.');
            this.modalRef.close({ updated: value });
          },
          onError: () => {
            this.message.error('Не вдалося зберегти зміни. Спробуйте ще раз.');
          },
        }
      );
    } else {
      this.participantService.createMutation.mutate(value, {
        onSuccess: () => {
          this.message.success('Учасника успішно додано.');
          this.modalRef.close(true);
        },
        onError: () => {
          this.message.error('Не вдалося додати учасника. Спробуйте ще раз.');
        },
      });
    }
  }
}
