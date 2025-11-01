import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ChangeEventMode } from '../../const/change-event-mode';

@Component({
  selector: 'app-delete-mode-modal',
  templateUrl: './change-event-mode-modal.component.html',
  styleUrl: './change-event-mode-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzButtonModule],
})
export class ChangeEventModeModalComponent {
  private readonly modalRef = inject(NzModalRef);

  public changeAll() {
    this.modalRef.close(ChangeEventMode.ALL);
  }
  public changeSingle() {
    this.modalRef.close(ChangeEventMode.SINGLE);
  }
  public changeFuture() {
    this.modalRef.close(ChangeEventMode.FUTURE);
  }
}
