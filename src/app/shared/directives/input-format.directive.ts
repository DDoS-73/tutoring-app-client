import { Directive, ElementRef, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { PhoneUtils } from '../utils/phone.utils';
import { StringUtils } from '../utils/string.utils';

export type InputFormat = 'digits' | 'capitalize';

@Directive({
  selector: 'input[appInputFormat]',
  host: {
    '(input)': 'onInput()',
  },
})
export class InputFormatDirective {
  private static readonly FORMATTERS: Record<InputFormat, (value: string, maxDigits: number) => string> = {
    digits: PhoneUtils.digitsOnly,
    capitalize: StringUtils.capitalizeFirst,
  };

  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly ngControl = inject(NgControl, { self: true });

  public readonly appInputFormat = input.required<InputFormat>();
  public readonly maxDigits = input(Number.MAX_SAFE_INTEGER);

  protected onInput(): void {
    const raw = this.element.nativeElement.value;
    const formatted = InputFormatDirective.FORMATTERS[this.appInputFormat()](raw, this.maxDigits());
    if (formatted === raw) return;
    this.element.nativeElement.value = formatted;
    this.ngControl.control?.setValue(formatted);
  }
}
