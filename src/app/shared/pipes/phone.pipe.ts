import { Pipe, PipeTransform } from '@angular/core';
import { PhoneUtils } from '../utils/phone.utils';

@Pipe({ name: 'phone' })
export class PhonePipe implements PipeTransform {
  public transform(phone: string | null | undefined): string | null {
    return PhoneUtils.toDisplay(phone);
  }
}
