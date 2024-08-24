import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import {
  EditMilestoneEstimatesComponent,
} from '@Components/edit-milestone-estimates/edit-milestone-estimates.component';
import {
  EditMilestoneEstimatesTabComponent,
} from '@Components/edit-milestone-estimates-tab/edit-milestone-estimates-tab.component';
import { ProjectMilestone } from '@Models/project-milestone';
import { DateService } from '@Services/date.service';
import { Nullable } from '@Types';
import { MatTabGroup } from '@angular/material/tabs';

describe('Component: EditMilestoneEstimatesComponent', () => {
  let component: EditMilestoneEstimatesComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesComponent>;
  let milestones: any[];
  let project: any;

  @Component({
    selector: 'hsel-edit-milestone-estimates-tab',
    template: '',
    standalone: true,
  })
  class EditMilestoneEstimatesTabComponentStub {
    @Input() reportStart!: string;
    @Input() reportEnd: Nullable<string> = null;
    @Input() reportInterval!: number;
    @Input() milestone!: ProjectMilestone;
    @Output() onDelete: EventEmitter<void> = new EventEmitter();
  }

  beforeEach(async () => {
    milestones = [{
      id: '1',
      estimates: [{
        reportDate: '2024-01-01',
      }, {
        reportDate: '2024-01-08',
      }, {
        reportDate: '2024-01-15',
      }],
    }, {
      id: '2',
      estimates: [{
        reportDate: '2024-01-01',
      }, {
        reportDate: '2024-01-08',
      }, {
        reportDate: '2024-01-15',
      }, {
        reportDate: '2024-01-22',
      }],
    }, {
      id: '3',
      estimates: [{
        reportDate: '2024-01-01',
      }, {
        reportDate: '2024-01-08',
      }, {
        reportDate: '2024-01-15',
      }, {
        reportDate: '2024-01-22',
      }, {
        reportDate: '2024-01-29',
      }],
    }];
    project = {
      officialStart: '2024-01-01',
      officialEnd: '2024-01-29',
      reportInterval: 7,
    };

    TestBed.overrideComponent(EditMilestoneEstimatesComponent, {
      add: {
        imports: [EditMilestoneEstimatesTabComponentStub],
      },
      remove: {
        imports: [EditMilestoneEstimatesTabComponent],
      },
    });
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              milestones,
              project,
            })
          },
        },
        DateService,
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMilestoneEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render three tabs within the tab-group', () => {
    const tabGroup = fixture.debugElement.query(By.css('mat-tab-group'));
    const tabGroupInstance: MatTabGroup = tabGroup.componentInstance;

    expect(tabGroupInstance._tabs.length).toBe(3);
  });

  describe('removeMilestone(string): void', () => {
    it('should remove the second milestone', () => {
      expect(component.milestones).toContain(milestones[1]);

      component.removeMilestone('2');

      expect(component.milestones).not.toContain(milestones[1]);
    });
  });
});
