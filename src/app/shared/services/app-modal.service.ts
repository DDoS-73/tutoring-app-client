import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { MODAL_CLASS, MODAL_WIDTH } from '../models/modal.const';
import { StringUtils } from '../utils/string.utils';

export type FormModalSize = 'form' | 'compact';

export interface ConfirmDangerOptions {
  title: string;
  content: string | TemplateRef<void>;
  okText: string;
  iconType: string;
  onOk: () => Promise<unknown>;
}

@Injectable({ providedIn: 'root' })
export class AppModalService {
  private readonly modal = inject(NzModalService);

  public openForm<C, R = any>(content: Type<C>, data?: unknown, size: FormModalSize = 'form'): NzModalRef<C, R> {
    return this.modal.create<C, unknown, R>({
      nzContent: content,
      nzData: data,
      nzFooter: null,
      nzTitle: undefined,
      nzClosable: false,
      nzCentered: true,
      nzWidth: MODAL_WIDTH[size],
      nzClassName: MODAL_CLASS[size],
    });
  }

  public confirmDanger(options: ConfirmDangerOptions): void {
    this.modal.confirm({
      nzTitle: StringUtils.escapeHtml(options.title),
      nzContent: typeof options.content === 'string' ? StringUtils.escapeHtml(options.content) : options.content,
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
