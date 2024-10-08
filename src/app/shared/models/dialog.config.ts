import { MatDialogConfig } from '@angular/material/dialog';

export class DialogConfig<D> extends MatDialogConfig<D> {
    override minWidth = '60vw';
    override minHeight = '85vh';
    override autoFocus = false;
}
