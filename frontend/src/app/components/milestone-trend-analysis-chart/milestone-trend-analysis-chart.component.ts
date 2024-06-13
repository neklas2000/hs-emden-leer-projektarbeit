import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AgChartsAngular } from 'ag-charts-angular';
import { AgChartInstance, AgChartOptions, AgCharts } from 'ag-charts-community';
import { Subscription } from 'rxjs';

import { ProjectMilestone } from '@Models/project-milestone';
import { Nullable } from '@Types';
import { AgChartService } from '@Services/ag-chart.service';
import { ThemeMode, ThemeService } from '@Services/theme.service';

@Component({
  selector: 'hsel-milestone-trend-analysis-chart',
  standalone: true,
  imports: [AgChartsAngular],
  templateUrl: './milestone-trend-analysis-chart.component.html',
  styleUrl: './milestone-trend-analysis-chart.component.scss'
})
export class MilestoneTrendAnalysisChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  @Input() startDate!: string;
  @Input() endDate: Nullable<string> = null;
  @Input() interval: number = 7;
  @Input() milestones: ProjectMilestone[] = [];
  @Input() reportDates: string[] = [];

  private options!: AgChartOptions;
  private themeSubscription!: Subscription;
  private chartInstance!: AgChartInstance;
  private currentMode!: ThemeMode;

  constructor(
    private readonly agChart: AgChartService,
    private readonly theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.defineOptions();
  }

  refresh(): void {
    this.defineOptions();
    this.createChartInstance();
  }

  private defineOptions(): void {
    this.agChart.defineOptions({
      start: this.startDate,
      end: this.endDate,
      milestones: this.milestones,
      interval: this.interval,
    });

    this.options = this.agChart.options;
  }

  ngAfterViewInit(): void {
    this.createChartInstance();

    this.themeSubscription = this.theme.modeStateChanged$.subscribe((theme) => {
      this.chartInstance.resetAnimations();

      AgCharts.updateDelta(this.chartInstance, {
        theme: theme === ThemeMode.DARK ? 'ag-default-dark' : 'ag-default',
      });

      this.currentMode = theme;
    });
  }

  private createChartInstance(): void {
    this.options.container = this.chartContainer.nativeElement;

    if (this.chartInstance) {
      this.chartInstance.destroy()
    }

    this.chartInstance = AgCharts.create(this.options);

    if (this.currentMode) {
      AgCharts.updateDelta(this.chartInstance, {
        theme: this.currentMode === ThemeMode.DARK ? 'ag-default-dark' : 'ag-default',
      });
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
