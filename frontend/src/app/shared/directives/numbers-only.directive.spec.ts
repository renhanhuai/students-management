import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  standalone: true,
  imports: [NumbersOnlyDirective],
  template: '<input numbersOnly>'
})
class TestHostComponent {}

describe('NumbersOnlyDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('removes non-digit characters and keeps the model input event in sync', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    let inputEvents = 0;
    input.addEventListener('input', () => inputEvents++);
    input.value = '(212) 555-0101';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(input.value).toBe('2125550101');
    expect(inputEvents).toBe(2);
  });

  it('leaves a numeric value unchanged', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '12345';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.value).toBe('12345');
  });
});
