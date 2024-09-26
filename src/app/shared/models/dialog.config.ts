import { MatDialogConfig } from '@angular/material/dialog';

export class DialogConfig<D> extends MatDialogConfig<D> {
    override minWidth = '60vw';
    override minHeight = '80vh';
    override autoFocus = false;
}
