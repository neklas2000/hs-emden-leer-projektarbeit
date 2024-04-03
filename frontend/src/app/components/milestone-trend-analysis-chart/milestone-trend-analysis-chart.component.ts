import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import { Nullable } from '../../types/nullable';
import { ProjectMilestone } from '../../models/project-milestone';
import { ChartService, ChartOptions } from '../../services/chart.service';

@Component({
  selector: 'app-milestone-trend-analysis-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './milestone-trend-analysis-chart.component.html',
  styleUrl: './milestone-trend-analysis-chart.component.scss'
})
export class MilestoneTrendAnalysisChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  @Input() startDate!: string;
  @Input() endDate: Nullable<string> = null;
  @Input() interval: number = 7;
  @Input() milestones: ProjectMilestone[] = [];
  @Input() reportDates: string[] = [];

  chartOptions!: ChartOptions;

  constructor(private readonly chartService: ChartService) {}

  ngOnInit(): void {
    this.createChart();
  }

  private createChart() {
    this.chartService.defineOptions({
      start: this.startDate,
      end: this.endDate,
      interval: this.interval,
      milestones: this.milestones,
      reportDates: this.reportDates,
    });

    this.chartOptions = this.chartService.options;
  }
}
