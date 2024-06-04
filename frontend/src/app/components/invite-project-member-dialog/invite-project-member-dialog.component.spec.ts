import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { InviteProjectMemberDialogComponent } from './invite-project-member-dialog.component';
import { UserService } from '@Services/user.service';

describe('Component: InviteProjectMemberDialogComponent', () => {
  let component: InviteProjectMemberDialogComponent;
  let fixture: ComponentFixture<InviteProjectMemberDialogComponent>;
  let closeSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    closeSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [InviteProjectMemberDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: closeSpy,
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            role: 'viewer',
          },
        },
        UserService,
        provideHttpClient(),
        provideAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteProjectMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
