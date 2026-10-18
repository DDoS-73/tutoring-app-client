import { NzModalRef } from 'ng-zorro-antd/modal';

export class ModalUtils {
  public static blockCloseWhile(modalRef: NzModalRef, isBusy: () => boolean): void {
    modalRef.updateConfig({ nzOnCancel: () => (isBusy() ? false : undefined) });
  }
}
