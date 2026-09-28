export class PhoneUtils {
  private static readonly PHONE_PATTERN = /^(\d{10}|\d{12})$/;

  public static digitsOnly(value: string, maxDigits: number): string {
    return value.replace(/\D/g, '').slice(0, maxDigits);
  }

  public static isValid(value: string): boolean {
    return PhoneUtils.PHONE_PATTERN.test(value);
  }
}
