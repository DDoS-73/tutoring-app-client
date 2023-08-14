import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightToday]'
})
export class HighlightTodayDirective implements OnInit {
  @Input({ required: true }) day!: number;
  constructor(private elRef: ElementRef) {  }

  ngOnInit() {
    const today = new Date().getDay();
    if (today === this.day) {
      this.elRef.nativeElement.classList.add('highlight_today');
      // this.elRef.nativeElement.style.backgroundColor = '#e0e0e0';
    }
  }
}
