import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Subscription, take } from 'rxjs';

import { AppSettingsService, PrimaryActionPosition } from '../../services/app-settings.service';

@Component({
  selector: 'hsel-projects',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  standalone: true,
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Entities.Project[] = [];
  primaryActionPosition: PrimaryActionPosition = PrimaryActionPosition.BOTTOM_RIGHT;
  private displaySettingsSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appSettings: AppSettingsService,
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe({
      next: ({ projects }) => {
        this.projects = projects ?? [];

        console.log(this.projects);
      },
    });
    this.displaySettingsSubscription = this.appSettings.display$
      .subscribe((displaySettings) => {
        this.primaryActionPosition = displaySettings.primaryActionPosition;
      });
  }

  ngOnDestroy(): void {
    if (this.displaySettingsSubscription) {
      this.displaySettingsSubscription.unsubscribe();
    }
  }
}
