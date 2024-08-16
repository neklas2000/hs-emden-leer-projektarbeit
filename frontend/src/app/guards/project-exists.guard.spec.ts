import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { projectExistsGuard } from '@Guards/project-exists.guard';

describe('Guard: projectExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => projectExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    expect(executeGuard).toBeTruthy();
  });
});
