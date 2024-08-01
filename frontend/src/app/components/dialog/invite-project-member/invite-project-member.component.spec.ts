import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { InviteProjectMemberComponent } from './invite-project-member.component';
import { ProjectRole } from '@Models/project-member';
import { UserService } from '@Services/user.service';

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
        UserService,
        provideHttpClient(),
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
});
