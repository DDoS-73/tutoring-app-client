import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Option } from '../../../../shared/models/option';
import { ChangeEventMode } from '../../const/change-event-mode';

@Component({
  selector: 'app-delete-mode-modal',
  templateUrl: './change-event-mode-modal.component.html',
  styleUrl: './change-event-mode-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzButtonModule, NzIconModule],
})
export class ChangeEventModeModalComponent {
  protected readonly modalRef = inject(NzModalRef);
  protected readonly data = inject<Option<ChangeEventMode>[]>(NZ_MODAL_DATA);

  protected get title(): string {
    const isDelete = this.data.some((opt) => opt.label.toLowerCase().includes('видалити'));
    return isDelete ? 'Видалення події' : 'Оновлення події';
  }
}
