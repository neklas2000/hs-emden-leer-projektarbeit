import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AgChartsAngular } from 'ag-charts-angular';
import { AgChartInstance, AgChartOptions, AgCharts } from 'ag-charts-community';

import { AgChartService } from '@Services/ag-chart.service';
import { ThemeService } from '@Services/theme.service';
import { Subscription } from 'rxjs';

const project = {
  officialStart: '2023-03-07',
  officialEnd: '2023-05-30',
  reportInterval: 7,
  milestones: [
    {
      name: 'Anforderungen festlegen',
      estimates: [
        {
          reportDate: '2023-03-07',
          estimationDate: '2023-04-04',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-14',
          estimationDate: '2023-04-04',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-21',
          estimationDate: '2023-04-04',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-28',
          estimationDate: '2023-04-04',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-04',
          estimationDate: '2023-04-04',
          milestoneReached: true,
        },
      ],
    },
    {
      name: "Hochladen/Analyse der Daten",
      estimates: [
        {
          reportDate: '2023-03-07',
          estimationDate: '2023-04-18',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-14',
          estimationDate: '2023-04-18',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-21',
          estimationDate: '2023-04-18',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-28',
          estimationDate: '2023-04-18',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-04',
          estimationDate: '2023-04-11',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-11',
          estimationDate: '2023-04-11',
          milestoneReached: true,
        },
      ],
    },
    {
      name: 'Anwendungsdesign festgelegt',
      estimates: [
        {
          reportDate: '2023-03-07',
          estimationDate: '2023-05-02',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-14',
          estimationDate: '2023-05-02',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-21',
          estimationDate: '2023-05-02',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-28',
          estimationDate: '2023-05-02',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-04',
          estimationDate: '2023-05-02',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-11',
          estimationDate: '2023-04-25',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-18',
          estimationDate: '2023-04-18',
          milestoneReached: true,
        },
      ],
    },
    {
      name: 'Integration von Design/Funktionalität',
      estimates: [
        {
          reportDate: '2023-03-07',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-14',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-21',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-28',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-04',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-11',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-18',
          estimationDate: '2023-05-16',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-25',
          estimationDate: '2023-05-09',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-02',
          estimationDate: '2023-05-02',
          milestoneReached: true,
        },
      ],
    },
    {
      name: 'Abschluss Qualitätssicherung',
      estimates: [
        {
          reportDate: '2023-03-07',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-14',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-21',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-28',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-04',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-11',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-18',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-25',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-02',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-09',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-16',
          estimationDate: '2023-05-23',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-23',
          estimationDate: '2023-05-23',
          milestoneReached: true,
        },
      ],
    },
    {
      name: 'Abgabe Präsentation',
      estimates: [
        {
          reportDate: '2023-03-07',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-14',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-21',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-03-28',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-04',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-11',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-18',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-04-25',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-02',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-09',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-16',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-23',
          estimationDate: '2023-05-30',
          milestoneReached: false,
        },
        {
          reportDate: '2023-05-30',
          estimationDate: '2023-05-30',
          milestoneReached: true,
        },
      ],
    },
  ],
};

@Component({
  selector: 'hsel-home',
  standalone: true,
  imports: [
    AgChartsAngular
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  private options!: AgChartOptions;
  private themeSubscription!: Subscription;
  private chartInstance!: AgChartInstance;

  constructor(
    private readonly agChart: AgChartService,
    private readonly theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.agChart.defineOptions({
      start: project.officialStart,
      end: project.officialEnd,
      milestones: project.milestones as any[],
      interval: project.reportInterval,
    });

    this.options = this.agChart.options;
  }

  ngAfterViewInit(): void {
    this.options.container = this.chartContainer.nativeElement;
    this.chartInstance = AgCharts.create(this.options);

    this.themeSubscription = this.theme.modeStateChanged$.subscribe((_) => {
      this.chartInstance.resetAnimations();

      AgCharts.updateDelta(this.chartInstance, {
        title: {
          color: 'currentColor',
        },
      });
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
