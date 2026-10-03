import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let service: ConfirmationService;
  beforeEach(() => { service = TestBed.inject(ConfirmationService); });

  it('publishes the prompt and emits the selected result', () => {
    const options = { title: 'Delete?', message: 'Remove this record?' };
    let prompt = null;
    service.confirmation$.subscribe((value) => prompt = value);
    let result: boolean | undefined;
    service.confirm(options).subscribe((value) => result = value);

    expect(prompt).toEqual(options);
    service.close(true);
    expect(result).toBe(true);
    expect(prompt).toBeNull();
  });

  it('cancels an earlier prompt when another prompt replaces it', () => {
    let firstResult: boolean | undefined;
    let secondResult: boolean | undefined;
    service.confirm({ title: 'First', message: 'First prompt' }).subscribe((value) => firstResult = value);
    service.confirm({ title: 'Second', message: 'Second prompt' }).subscribe((value) => secondResult = value);
    service.close(true);

    expect(firstResult).toBe(false);
    expect(secondResult).toBe(true);
  });
});
