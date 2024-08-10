import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { EditProjectComponent } from './edit-project.component';
import { ProjectService } from '@Services/project.service';

describe('Component: EditProjectComponent', () => {
  let component: EditProjectComponent;
  let fixture: ComponentFixture<EditProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProjectComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              project: null,
            }),
          },
        },
        ProjectService,
        provideHttpClient(),
        provideLuxonDateAdapter(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
