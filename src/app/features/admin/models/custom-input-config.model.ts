import { InputFormat } from '../../../shared/directives/input-format.directive';

export interface CustomInputConfig {
  format: InputFormat;
  inputMode: 'text' | 'numeric';
  placeholder: string;
  maxLength: number | null;
  maxDigits: number;
  prefix?: string;
  counter?: { from: number; max: number };
  emptyHint?: string;
}
