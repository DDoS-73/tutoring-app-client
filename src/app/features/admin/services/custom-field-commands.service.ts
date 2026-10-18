import { inject, Injectable } from '@angular/core';
import { CustomField } from '../../../shared/models/custom-field.model';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { CustomFieldModalComponent } from '../components/participants/custom-field-modal/custom-field-modal.component';
import { CustomFieldModalData, CustomFieldOwner } from '../models/custom-field-modal.model';
import { CustomFieldService } from './custom-field.service';

@Injectable({ providedIn: 'root' })
export class CustomFieldCommandsService {
  private readonly modal = inject(AppModalService);
  private readonly customFieldService = inject(CustomFieldService);

  public add(owner: CustomFieldOwner): void {
    this.open({ owner });
  }

  public edit(owner: CustomFieldOwner, field: CustomField): void {
    this.open({ owner, field });
  }

  public delete(field: CustomField): void {
    this.modal.confirmDanger({
      title: `Delete “${field.name}”?`,
      content: field.deleteConfirmText,
      okText: 'Delete',
      iconType: 'delete',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.customFieldService.deleteMutation.mutate(field.id, {
            onSuccess: () => resolve(true),
            onError: () => reject(),
          });
        }),
    });
  }

  private open(data: CustomFieldModalData): void {
    this.modal.openForm(CustomFieldModalComponent, data, 'compact');
  }
}
