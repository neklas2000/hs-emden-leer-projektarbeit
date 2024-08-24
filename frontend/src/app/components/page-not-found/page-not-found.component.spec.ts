import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { PageNotFoundComponent } from '@Components/page-not-found/page-not-found.component';
import { WindowProviderService } from '@Services/window-provider.service';

describe('Component: PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let historyBackSpy: jasmine.Spy<jasmine.Func>;
  let router: Router;

  beforeEach(async () => {
    historyBackSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [
        provideRouter([]),
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => ({
              history: {
                back: historyBackSpy,
              },
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goOneBack(): void', () => {
    it('should go one page back in the windows history', () => {
      component.goOneBack();

      expect(historyBackSpy).toHaveBeenCalled();
    });
  });

  describe('goToHomepage(): void', () => {
    it('should redirect the user to the homepage', () => {
      spyOn(router, 'navigateByUrl');

      component.goToHomepage();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });
});
