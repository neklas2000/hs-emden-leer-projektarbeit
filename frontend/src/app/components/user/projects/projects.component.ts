import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Project } from '@Models/project';
import { User } from '@Models/user';
import { ProjectTypePipe } from '@Pipes/project-type.pipe';
import { SnackbarService } from '@Services/snackbar.service';

@Component({
  selector: 'hsel-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ProjectTypePipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  private profile!: User;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackbar: SnackbarService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projects, profile }) => {
      this.projects = projects;
      this.profile = profile;
    });
  }

  createNewProject(): void {
    if (!this.profile.firstName || !this.profile.lastName || !this.profile.matriculationNumber) {
      this.snackbar.showWarning('Für diese Aktion müssen Sie erst die persönlichen Daten angeben');
      this.router.navigateByUrl('/profile');
    } else {
      this.router.navigateByUrl('/projects/new');
    }
  }
}
