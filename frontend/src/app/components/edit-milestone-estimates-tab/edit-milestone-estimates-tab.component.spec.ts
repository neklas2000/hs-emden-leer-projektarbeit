import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { EditMilestoneEstimatesTabComponent } from './edit-milestone-estimates-tab.component';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';

describe('Component: EditMilestoneEstimatesTabComponent', () => {
  let component: EditMilestoneEstimatesTabComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesTabComponent],
      providers: [
        JsonApiDatastore,
        provideHttpClient(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMilestoneEstimatesTabComponent);
    component = fixture.componentInstance;
    component.milestone = {
      estimates: [],
      id: '1',
      name: 'Milestone A',
      project: null,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
