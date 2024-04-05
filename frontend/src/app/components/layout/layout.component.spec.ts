import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { LayoutComponent } from './layout.component';
import { AuthenticationService } from '@Services/authentication.service';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';

describe('Component: LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ logo: 'I am the logo' }),
          },
        },
        AuthenticationService,
        JsonApiDatastore,
        provideHttpClient(),
        provideAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
