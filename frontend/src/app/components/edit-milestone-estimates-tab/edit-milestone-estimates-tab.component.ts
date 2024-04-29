import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';

import { NgApexchartsModule } from 'ng-apexcharts';
import { take } from 'rxjs';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ProjectMilestone } from '@Models/project-milestone';
import { MilestoneEstimate } from '@Models/milestone-estimate';
import { ChartOptions, ChartService, FreeMarkers } from '@Services/chart.service';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { SnackbarService } from '@Services/snackbar.service';
import { DateService } from '@Services/date.service';
import { Nullable } from '@Types';
import { Tupel } from '@Utils/tupel';

type ApexChartEventConfig = {
  /**
   * Index of the data series.
   */
  seriesIndex: number;
  /**
   * Index on the x-axis.
   */
  dataPointIndex: number;
  [key: string]: any;
};

@Component({
  selector: 'hsel-edit-milestone-estimates-tab',
  standalone: true,
  imports: [
    MatInputModule,
    MatCommonModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    DatePipe,
    MatDatepickerModule,
    CommonModule,
    NgApexchartsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './edit-milestone-estimates-tab.component.html',
  styleUrl: './edit-milestone-estimates-tab.component.scss'
})
export class EditMilestoneEstimatesTabComponent implements OnInit, AfterViewInit {
  @ViewChild('apexChartContainer') private apexChartContainer!: ElementRef<HTMLDivElement>;
  @Input() reportDates: string[] = [];
  @Input() milestone!: ProjectMilestone;
  @Input() interval: number = 7;
  @Input() renderChart: boolean = false;

  chartOptions: Nullable<ChartOptions> = null;
  annotations!: ApexAnnotations;
  milestoneReached: boolean = false;

  private selectedPoint: Tupel<string, number> = new Tupel();
  private selectedMarker: Tupel<number> = new Tupel();
  private markerPoints!: FreeMarkers;

  constructor(
    private readonly chart: ChartService,
    private readonly dialog: MatDialog,
    private readonly jsonApiDatastore: JsonApiDatastore,
    private readonly snackbar: SnackbarService,
    private readonly date: DateService,
  ) { }

  ngOnInit(): void {
    this.chart.defineOptions({
      reportDates: this.reportDates,
      milestones: [this.milestone],
      start: this.reportDates[0],
      end: this.reportDates[this.reportDates.length - 1],
      interval: this.interval,
    });
    this.chartOptions = this.chart.options;
    this.chartOptions.chart.events = {
      dataPointSelection: (ev, ctx, cfg) => {
        this.handleDataPointSelection(cfg);
      },
    };
    this.annotations = {
      points: [],
    };
    this.markerPoints = this.chart.markerPoints;
    this.defineAnnotations();
    this.milestoneReached = this.milestone.estimates
      .filter((estimate) => estimate.milestoneReached).length > 0;
  }

  ngAfterViewInit(): void {
    this.apexChartContainer.nativeElement.addEventListener('mouseover', (ev) => {
      if (!ev.target) return;

      const marker = ev.target as SVGCircleElement;

      if (marker.classList.contains('apexcharts-point-annotation-marker')) {
        marker.setAttribute('r', String(Number(marker.getAttribute('r')) * 2));
      }
    });

    this.apexChartContainer.nativeElement.addEventListener('mouseout', (ev) => {
      if (!ev.target) return;

      const marker = ev.target as SVGCircleElement;

      if (marker.classList.contains('apexcharts-point-annotation-marker')) {
        marker.setAttribute('r', String(Number(marker.getAttribute('r')) / 2));
      }
    });
  }

  private defineAnnotations(...keepColumns: number[]): void {
    const points = this.markerPoints.clone();
    this.annotations.points = [];

    const numberOfPoints = this.chartOptions?.series[1].data.length || -1;

    if (numberOfPoints !== -1 && keepColumns.length === 0) {
      keepColumns.push(numberOfPoints);
    }

    this.chartOptions?.series[1].data.forEach((yAxisIndex, xAxisIndex) => {
      points.remove(xAxisIndex, yAxisIndex as number);
    });

    if (keepColumns.length !== 0) {
      for (let i = 0; i < points.categories.size; i++) {
        if (!keepColumns.includes(i)) {
          points.dropColumn(i);
        }
      }
    }

    for (const [xAxis, yAxes] of points.markers.entries()) {
      if (!xAxis) continue;

      for (const y of yAxes) {
        this.annotations.points.push({
          x: xAxis,
          y,
          marker: {
            cssClass: 'apexcharts-marker',
          },
          click: (options: any, event: MouseEvent) => {
            this.handlePointClick(options.x, options.y);
          },
        });
      }
    }
  }

  private handleDataPointSelection({
    seriesIndex,
    dataPointIndex,
  }: ApexChartEventConfig): void {
    if (seriesIndex !== 0) {
      if (this.selectedMarker.x === dataPointIndex && this.selectedMarker.y === seriesIndex) {
        this.selectedMarker.reset();
        this.defineAnnotations();
      } else {
        this.selectedMarker.x = dataPointIndex;
        this.selectedMarker.y = seriesIndex;
        this.defineAnnotations(dataPointIndex);
      }

      this.annotations = { ...this.annotations };
    } else {
      if (this.chartOptions && !this.selectedMarker.isEmpty && dataPointIndex === this.selectedMarker.x) {
        const markerX = this.selectedMarker.x as number;
        const newMarkerY = this.chartOptions.series[0].data[dataPointIndex] as number;

        this.updateChart(markerX, newMarkerY);
      }
    }
  }

  private handlePointClick(x: string, y: number): void {
    this.selectedPoint.x = x;
    this.selectedPoint.y = y;

    if (!this.selectedMarker.isEmpty && this.selectedMarker.y !== 0) {
      const markerX = this.selectedMarker.x as number;
      const newMarkery = this.selectedPoint.y as number;

      this.updateChart(markerX, newMarkery);
    } else {
      if (!this.milestoneReached && !this.isIntersectingTargetLine()) {
        const xIndex = this.markerPoints.categories.indexOfAxisLabel(x, 'x');
        const estimate = new MilestoneEstimate();
        estimate.reportDate = this.markerPoints.categories.yAxis[xIndex];
        estimate.estimationDate = this.markerPoints.categories.yAxis[y];
        estimate.milestone = this.milestone;
        estimate.milestoneReached = this.date.compare(
          estimate.reportDate,
          estimate.estimationDate,
        ) === 0;
        this.milestone.estimates.push(estimate);

        this.updateChart(xIndex, y);
      } else if (this.milestoneReached) {
        this.snackbar.open('Der Meilenstein ist abgeschlossen');
      } else {
        this.snackbar.open('Der Meilenstein kreuzt noch die Ziellinie');
      }
    }
  }

  private isIntersectingTargetLine(): boolean {
    for (const estimate of this.milestone.estimates) {
      if (this.date.compare(estimate.estimationDate as string, estimate.reportDate) === 0) return true;
    }

    return false;
  }

  private updateChart(x: number, y: number): boolean {
    if (!this.chartOptions) return false;

    (this.chartOptions.series[1].data as number[])[x] = y;
    this.defineAnnotations();
    this.chartOptions.series = [...this.chartOptions.series];
    this.annotations = { ...this.annotations };
    this.selectedMarker.reset();

    return true;
  }

  onSaveChanges(): void { }

  onDiscardChanges(): void { }

  onMilestoneDelete(): void {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        minWidth: '200px',
        width: '40vw',
        data: {
          type: 'delete-milestone',
        },
      },
    );

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        console.log('Should delete the milestone'); // TODO
        this.snackbar.open('Meilenstein wurde gelöscht');
      } else {
        this.snackbar.open('Meilenstein wurde nicht gelöscht');
      }
    });
  }
}
