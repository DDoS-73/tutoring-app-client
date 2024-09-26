import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'hour',
})
export class HourPipe implements PipeTransform {
    transform(value: number): string {
        return value < 10 ? `0${value}:00` : `${value}:00`;
    }
}
