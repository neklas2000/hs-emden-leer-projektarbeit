import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProjectMemberRemovalComponent } from './confirm-project-member-removal.component';

describe('ConfirmProjectMemberRemovalComponent', () => {
  let component: ConfirmProjectMemberRemovalComponent;
  let fixture: ComponentFixture<ConfirmProjectMemberRemovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProjectMemberRemovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmProjectMemberRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
