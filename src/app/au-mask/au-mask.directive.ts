import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[au-mask]'
})
export class AuMaskDirective implements OnInit {

  @Input('au-mask') mask = '';

  input: HTMLInputElement;

  constructor(el: ElementRef) { 
    this.input = el.nativeElement;
  }

  ngOnInit() {

  }

}
