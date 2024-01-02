import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteProjectMemberDialogComponent } from './invite-project-member-dialog.component';

describe('InviteProjectMemberDialogComponent', () => {
  let component: InviteProjectMemberDialogComponent;
  let fixture: ComponentFixture<InviteProjectMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteProjectMemberDialogComponent]
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
