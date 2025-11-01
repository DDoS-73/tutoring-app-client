import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DeleteMode } from '../../const/delete-mode';

@Component({
  selector: 'app-delete-mode-modal',
  templateUrl: './delete-mode-modal.component.html',
  styleUrl: './delete-mode-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzButtonModule],
})
export class DeleteModeModalComponent {
  private readonly modalRef = inject(NzModalRef);

  public deleteAll() {
    this.modalRef.close(DeleteMode.ALL);
  }
  public deleteSingle() {
    this.modalRef.close(DeleteMode.SINGLE);
  }
  public deleteFuture() {
    this.modalRef.close(DeleteMode.FUTURE);
  }
}
