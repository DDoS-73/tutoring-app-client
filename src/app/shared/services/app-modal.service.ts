import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { MODAL_CLASS, MODAL_WIDTH } from '../models/modal.const';

export interface ConfirmDangerOptions {
  title: string;
  content: TemplateRef<void>;
  okText: string;
  iconType: string;
  onOk: () => Promise<unknown>;
}

@Injectable({ providedIn: 'root' })
export class AppModalService {
  private readonly modal = inject(NzModalService);

  public openForm<C, R = any>(content: Type<C>, data?: unknown): NzModalRef<C, R> {
    return this.modal.create<C, unknown, R>({
      nzContent: content,
      nzData: data,
      nzFooter: null,
      nzTitle: undefined,
      nzClosable: false,
      nzCentered: true,
      nzWidth: MODAL_WIDTH.form,
      nzClassName: MODAL_CLASS.form,
    });
  }

  public confirmDanger(options: ConfirmDangerOptions): void {
    this.modal.confirm({
      nzTitle: options.title,
      nzContent: options.content,
      nzOkText: options.okText,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzIconType: options.iconType,
      nzCentered: true,
      nzClassName: MODAL_CLASS.confirm,
      nzOnOk: options.onOk,
    });
  }
}
