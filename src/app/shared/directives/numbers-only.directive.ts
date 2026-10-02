import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersOnly]',
  standalone: true
})
export class NumbersOnlyDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;
    const cursorPosition = input.selectionStart ?? originalValue.length;
    const digitsBeforeCursor = originalValue
      .slice(0, cursorPosition)
      .replace(/\D/g, '').length;
    const numericValue = originalValue.replace(/\D/g, '');

    if (originalValue === numericValue) {
      return;
    }

    input.value = numericValue;
    input.setSelectionRange(digitsBeforeCursor, digitsBeforeCursor);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
