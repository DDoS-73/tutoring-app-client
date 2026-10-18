export class PhoneUtils {
  private static readonly PHONE_PATTERN = /^(\d{10}|\d{12})$/;
  private static readonly LOCAL_PHONE_LENGTH = 10;

  public static digitsOnly(value: string, maxDigits: number): string {
    return value.replace(/\D/g, '').slice(0, maxDigits);
  }

  public static isValid(value: string): boolean {
    return PhoneUtils.PHONE_PATTERN.test(value);
  }

  public static toDisplay(phone: string | null | undefined): string | null {
    if (!phone) return null;
    return phone.length > PhoneUtils.LOCAL_PHONE_LENGTH ? `+${phone}` : phone;
  }
}
