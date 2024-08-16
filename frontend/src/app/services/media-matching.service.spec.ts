import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MediaMatching } from '@Services/media-matching.service';

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

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
