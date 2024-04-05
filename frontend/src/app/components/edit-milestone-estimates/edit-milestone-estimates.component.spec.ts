import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { EditMilestoneEstimatesComponent } from './edit-milestone-estimates.component';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';

describe('Component: EditMilestoneEstimatesComponent', () => {
  let component: EditMilestoneEstimatesComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              milestones: [],
              project: null,
            })
          },
        },
        JsonApiDatastore,
        provideHttpClient(),
        provideAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMilestoneEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
