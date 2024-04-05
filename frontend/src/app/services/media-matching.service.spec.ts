import { TestBed } from '@angular/core/testing';

import { MediaMatching } from './media-matching.service';
import { ChangeDetectorRef } from '@angular/core';

describe('Service: MediaMatching', () => {
  let service: MediaMatching;
  let detectChangesSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(() => {
    detectChangesSpy = jasmine.createSpy();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: detectChangesSpy,
          },
        },
      ],
    });

    service = TestBed.inject(MediaMatching);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
