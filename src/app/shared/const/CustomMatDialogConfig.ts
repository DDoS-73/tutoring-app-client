import { MatDialogConfig } from '@angular/material/dialog';

export class CustomMatDialogConfig<D> extends MatDialogConfig<D> {
  override minWidth = '100vw';
  override minHeight = '100vh';
  override autoFocus = false;
}
