import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SPECIAL_CHARACTERS } from './mask.utils';

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

    this.input.value = this.buildPlaceHolder();

  }

  buildPlaceHolder() {
    const chars = this.mask.split('');

    return chars.reduce((result, char) => SPECIAL_CHARACTERS.includes(char) ? `${result}${char}` : `${result}_`, '');
  }

}
