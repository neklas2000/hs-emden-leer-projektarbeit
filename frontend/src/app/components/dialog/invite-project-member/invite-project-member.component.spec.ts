import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteProjectMemberComponent } from './invite-project-member.component';

describe('InviteProjectMemberComponent', () => {
  let component: InviteProjectMemberComponent;
  let fixture: ComponentFixture<InviteProjectMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteProjectMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InviteProjectMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
