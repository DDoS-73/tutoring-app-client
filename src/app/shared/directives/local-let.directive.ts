import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
    localLet: T;
}

@Directive({
    selector: '[localLet]',
    standalone: true,
})
export class LetDirective<T> {
    private _context: LetContext<T> = {} as LetContext<T>;

    constructor(
        _viewContainer: ViewContainerRef,
        _templateRef: TemplateRef<LetContext<T>>
    ) {
        _viewContainer.createEmbeddedView(_templateRef, this._context);
    }

    @Input()
    set localLet(value: T) {
        this._context.localLet = value;
    }
}
