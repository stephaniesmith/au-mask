import { Directive, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { SPECIAL_CHARACTERS, TAB, overWriteCharAtPosition, LEFT_ARROW, RIGHT_ARROW } from './mask.utils';

import * as findLastIndex from 'lodash.findlastindex';

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
  onKeyDown($event: KeyboardEvent, keyCode) {
    if (keyCode !== TAB) {
      $event.preventDefault();
    }

    const key = String.fromCharCode(keyCode);
    const cursorPos = this.input.selectionStart;

    switch (keyCode) {
      case LEFT_ARROW:
        const valueBeforeCursor = this.input.value.slice(0, cursorPos).split('');
        const previousPos = findLastIndex(valueBeforeCursor, char => !SPECIAL_CHARACTERS.includes(char));

        if (previousPos >= 0) {
          this.input.setSelectionRange(previousPos, previousPos);
        }
        return;
      case RIGHT_ARROW:
        this.handleRightArrow(cursorPos);
        return;
    }

    overWriteCharAtPosition(this.input, cursorPos, key);
    this.handleRightArrow(cursorPos);
  }

  handleRightArrow(cursorPos) {
    const valueAfterCursor = this.input.value.slice(cursorPos + 1).split('');
    const nextPos = valueAfterCursor.findIndex(char => !SPECIAL_CHARACTERS.includes(char));

    if (nextPos >= 0) {
      const newCursorPos = cursorPos + nextPos + 1;
      this.input.setSelectionRange(newCursorPos, newCursorPos);
    }
  }

  buildPlaceHolder() {
    const chars = this.mask.split('');

    return chars.reduce((result, char) => SPECIAL_CHARACTERS.includes(char) ? `${result}${char}` : `${result}_`, '');
  }

}
