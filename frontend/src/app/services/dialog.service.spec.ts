import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { of, take } from 'rxjs';

import { DialogService } from '@Services/dialog.service';

describe('Service: DialogService', () => {
  let service: DialogService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatDialog],
    });

    service = TestBed.inject(DialogService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('open<T>(ComponentType<T>, MatDialogConfig<any>?): MatDialogRef<T, any>', () => {
    it('should open a dialog with the basic config', (done) => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      @Component({})
      class Comp {}

      service.open(Comp).afterClosed().pipe(take(1)).subscribe(() => {
        expect(dialog.open).toHaveBeenCalled();

        done();
      });
    });
  });
});
