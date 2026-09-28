import { Pipe, PipeTransform } from '@angular/core';

const LOCAL_PHONE_LENGTH = 10;

@Pipe({ name: 'phone' })
export class PhonePipe implements PipeTransform {
  public transform(phone: string | null | undefined): string | null {
    if (!phone) return null;
    return phone.length > LOCAL_PHONE_LENGTH ? `+${phone}` : phone;
  }
}
