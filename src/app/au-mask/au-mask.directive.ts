import { Directive, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { SPECIAL_CHARACTERS, TAB, overWriteCharAtPosition } from './mask.utils';

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

  @HostListener('keydown', ['$event', '$event.keyCode'])
  onkeydown($event: KeyboardEvent, keyCode) {
    if (keyCode !== TAB) {
      $event.preventDefault();
    }

    const key = String.fromCharCode(keyCode);
    const cursorPos = this.input.selectionStart;

    overWriteCharAtPosition(this.input, cursorPos, key);
  }

  buildPlaceHolder() {
    const chars = this.mask.split('');

    return chars.reduce((result, char) => SPECIAL_CHARACTERS.includes(char) ? `${result}${char}` : `${result}_`, '');
  }

}
