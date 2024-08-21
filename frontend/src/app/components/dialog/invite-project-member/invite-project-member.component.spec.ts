import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { Observable, of } from 'rxjs';

import {
  InviteProjectMemberComponent
} from '@Dialogs/invite-project-member/invite-project-member.component';
import { ProjectRole } from '@Models/project-member';
import { User } from '@Models/user';
import { UserService } from '@Services/user.service';

class UserServiceStub {
  search(term: string): Observable<User[]> {
    return of([]);
  }
}

describe('Component: InviteProjectMemberComponent', () => {
  let component: InviteProjectMemberComponent;
  let fixture: ComponentFixture<InviteProjectMemberComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [InviteProjectMemberComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            role: ProjectRole.Contributor,
          },
        }, {
          provide: MatDialogRef,
          useValue: {
            close: dialogRefCloseSpy,
          },
        },
        {
          provide: UserService,
          useClass: UserServiceStub,
        },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteProjectMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayWithFn(Nullable<User>, boolean): string', () => {
    it('should return an empty string since the user is null', () => {
      expect(component.displayWithFn(null)).toEqual('');
    });

    it('should create a label with all the available user data', () => {
      expect(component.displayWithFn({
        academicTitle: 'Prof.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
      } as any)).toEqual('Prof. Max Mustermann (1234567)');
    });

    it('should create a label without the matriculation number', () => {
      expect(component.displayWithFn({
        academicTitle: 'Prof.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: null,
      } as any)).toEqual('Prof. Max Mustermann');
    });
  });

  describe('onCancelClick(): void', () => {
    it('should close the dialog', () => {
      component.onCancelClick();

      expect(dialogRefCloseSpy).toHaveBeenCalled();
    });
  });

  describe('getCloseData(): DeepPartial<ProjectMember>', () => {
    it('should return an object with an empty user object', () => {
      expect(component.getCloseData()).toEqual({
        role: ProjectRole.Contributor,
        user: {},
      });
    });

    it('should return an object with an user object', () => {
      component.selectedUser.patchValue({
        id: '123',
      } as any);

      expect(component.getCloseData()).toEqual({
        role: ProjectRole.Contributor,
        user: {
          id: '123',
        },
      });
    });
  });

  describe('isUserSelected(): boolean', () => {
    it('should return false, since the input has no value, yet', () => {
      component.selectedUser.patchValue(null);

      expect(component.isUserSelected).toBeFalsy();
    });

    it('should return false, since the input value if of the type string', () => {
      component.selectedUser.patchValue('Max Mustermann');

      expect(component.isUserSelected).toBeFalsy();
    });

    it('should return true, since the input value is an object of an user', () => {
      component.selectedUser.patchValue({
        id: '123',
      } as any);

      expect(component.isUserSelected).toBeTruthy();
    });
  });
});
