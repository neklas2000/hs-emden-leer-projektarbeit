import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { ProjectsComponent } from '@Components/user/projects/projects.component';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let snackbar: SnackbarService;
  let router: Router;
  let routeDataSubject: BehaviorSubject<Data>;

  beforeEach(async () => {
    routeDataSubject = new BehaviorSubject({});
    routeDataSubject.next({
      projects: [],
      profile: {
        firstName: null,
        lastName: null,
        matriculationNumber: null,
      },
    });

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeDataSubject.asObservable(),
          },
        },
        SnackbarService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    snackbar = TestBed.inject(SnackbarService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createNewProject(): void', () => {
    it('should show a warning and redirect to the profile page, since the first- and lastname are null', () => {
      spyOn(snackbar, 'showWarning');
      spyOn(router, 'navigateByUrl');

      component.createNewProject();

      expect(snackbar.showWarning).toHaveBeenCalledWith('Für diese Aktion müssen Sie erst die persönlichen Daten angeben');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/profile');
      expect(router.navigateByUrl).not.toHaveBeenCalledWith('/projects/new');
    });

    it('should show a warning and redirect to the profile page, since only the lastname is null', () => {
      spyOn(snackbar, 'showWarning');
      spyOn(router, 'navigateByUrl');
      routeDataSubject.next({
        projects: [],
        profile: {
          firstName: 'Max',
          lastName: null,
          matriculationNumber: null,
        },
      });

      component.createNewProject();

      expect(snackbar.showWarning).toHaveBeenCalledWith('Für diese Aktion müssen Sie erst die persönlichen Daten angeben');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/profile');
      expect(router.navigateByUrl).not.toHaveBeenCalledWith('/projects/new');
    });

    it('should redirect to the project create page and not show any warning', () => {
      spyOn(snackbar, 'showWarning');
      spyOn(router, 'navigateByUrl');
      routeDataSubject.next({
        projects: [],
        profile: {
          firstName: 'Max',
          lastName: 'Mustermann',
          matriculationNumber: 1234567,
        },
      });

      component.createNewProject();

      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/new');
    });

    it('should redirect to the project create page and show a warning that the matriculation number is undefined', () => {
      spyOn(snackbar, 'showWarning');
      spyOn(router, 'navigateByUrl');
      routeDataSubject.next({
        projects: [],
        profile: {
          firstName: 'Max',
          lastName: 'Mustermann',
          matriculationNumber: null,
        },
      });

      component.createNewProject();

      expect(snackbar.showWarning).toHaveBeenCalledWith('Sie haben Ihre Matrikelnummer noch nicht hinterlegt');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/new');
    });

    it('should be triggered by the button click event', () => {
      spyOn(component, 'createNewProject');
      const btn = (<HTMLElement>fixture.nativeElement).querySelector('button');

      expect(btn).not.toBeNull();

      btn!.click();

      expect(component.createNewProject).toHaveBeenCalled();
    });
  });
});
