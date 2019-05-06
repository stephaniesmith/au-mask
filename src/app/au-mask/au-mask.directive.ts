import { Directive, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { SPECIAL_CHARACTERS, TAB, overWriteCharAtPosition, LEFT_ARROW, RIGHT_ARROW, BACKSPACE, DELETE } from './mask.utils';

import * as findLastIndex from 'lodash.findlastindex';
import { maskDigitValidators, neverValidator } from './digit_validators';

@Directive({
  selector: '[au-mask]'
})
export class AuMaskDirective implements OnInit {

  @Input('au-mask') mask = '';

  input: HTMLInputElement;

  fullFieldSelected = false;

  constructor(el: ElementRef) {
    this.input = el.nativeElement;
  }

  ngOnInit() {
    this.input.value = this.buildPlaceHolder();
  }

  @HostListener('select', ['$event'])
  onselect($event: UIEvent) {
    this.fullFieldSelected = this.input.selectionStart === 0 && this.input.selectionEnd === this.input.value.length;
  }

  @HostListener('keydown', ['$event', '$event.keyCode'])
  onKeyDown($event: KeyboardEvent, keyCode) {
    if ($event.metaKey || $event.ctrlKey) {
      return;
    }

    if (keyCode !== TAB) {
      $event.preventDefault();
    }

    const key = String.fromCharCode(keyCode);
    const cursorPos = this.input.selectionStart;


    if (this.fullFieldSelected) {
      this.input.value = this.buildPlaceHolder();
      const firstPlaceholderPos = this.input.value.split('').findIndex(char => char === '_');
      this.input.setSelectionRange(firstPlaceholderPos, firstPlaceholderPos);
    }

    switch (keyCode) {
      case LEFT_ARROW:
      this.handleLeftArrow(cursorPos);
        return;
      case RIGHT_ARROW:
        this.handleRightArrow(cursorPos);
        return;
      case BACKSPACE:
        this.handleBackspace(cursorPos);
        return;
      case DELETE:
        this.handleDelete(cursorPos);
        return;
    }

    const maskDigit = this.mask.charAt(cursorPos);
    const digitValidator = maskDigitValidators[maskDigit] || neverValidator;

    if (digitValidator(key)) {
      overWriteCharAtPosition(this.input, cursorPos, key);
      this.handleRightArrow(cursorPos);
    }

  }

  calculatePreviousCursorPos(cursorPos) {
    const valueBeforeCursor = this.input.value.slice(0, cursorPos).split('');
    return findLastIndex(valueBeforeCursor, char => !SPECIAL_CHARACTERS.includes(char));
  }

  handleLeftArrow(cursorPos) {
    const previousPos = this.calculatePreviousCursorPos(cursorPos);

    if (previousPos >= 0) {
      this.input.setSelectionRange(previousPos, previousPos);
    }
  }

  handleRightArrow(cursorPos) {
    const valueAfterCursor = this.input.value.slice(cursorPos + 1).split('');
    const nextPos = valueAfterCursor.findIndex(char => !SPECIAL_CHARACTERS.includes(char));

    if (nextPos >= 0) {
      const newCursorPos = cursorPos + nextPos + 1;
      this.input.setSelectionRange(newCursorPos, newCursorPos);
    }
  }

  handleBackspace(cursorPos) {
    const previousPos = this.calculatePreviousCursorPos(cursorPos);

    if (previousPos >= 0) {
      overWriteCharAtPosition(this.input, previousPos, '_');
      this.input.setSelectionRange(previousPos, previousPos);
    }
  }

  handleDelete(cursorPos) {
    overWriteCharAtPosition(this.input, cursorPos, '_');
    this.input.setSelectionRange(cursorPos, cursorPos);
  }

  buildPlaceHolder() {
    const chars = this.mask.split('');

    return chars.reduce((result, char) => SPECIAL_CHARACTERS.includes(char) ? `${result}${char}` : `${result}_`, '');
  }

}
