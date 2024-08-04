import { Injectable } from '@angular/core';

import { AgChartOptions, AgCharts, AgLineSeriesTooltipRendererParams } from 'ag-charts-community';
import { DateTime } from 'luxon';

import { DateService } from './date.service';
import { ProjectMilestone } from '@Models/project-milestone';
import { Nullable } from '@Types';

/**
 * @description
 * This class provides an easier access to all labels required by the x- and y-axis of the chart.
 * In order to reduce the runtime complexity labels will be memorized, once the getter has been
 * called for the first time.
 */
class Categories {
  private dates: DateTime[] = [];
  private xAxisLabels: string[] | null = null;
  private yAxisLabels: string[] | null = null;

  constructor(dates: string[] | DateTime[]) {
    if (dates.length > 0) {
      if (dates[0] instanceof DateTime) {
        this.dates = dates as DateTime[];
      } else {
        this.dates = (dates as string[]).map((date) => DateTime.fromSQL(date));
      }
    }
  }

  /**
   * @description
   * This function maps all dates to their string representation matching the format "MM/dd".
   * If this function is called for the first time the labels are memorized and for every other call
   * the memorized labels will be returned.
   *
   * @returns This property returns all labels for the x-axis of the chart diagram.
   */
  get xAxis(): string[] {
    if (!this.xAxisLabels) {
      this.xAxisLabels = this.dates.map((date) => date.toFormat('MM/dd'));
    }

    return this.xAxisLabels;
  }

  /**
   * @description
   * This function maps all dates to their string representation matching the format "dd.MM.yyyy".
   * If this function is called for the first time the labels are memorized and for every other call
   * the memorized labels will be returned.
   *
   * @returns This property returns all labels for the y-axis of the chart diagram.
   */
  get yAxis(): string[] {
    if (!this.yAxisLabels) {
      this.yAxisLabels = this.dates.map((date) => date.toFormat('dd.MM.yyyy'));
    }

    return this.yAxisLabels;
  }

  /**
   * @returns The amount of dates stored internally.
   */
  get size(): number {
    return this.dates.length;
  }

  /**
   * @description
   * This function returns the index of the axis label either from the x-axis or the y-axis labels.
   *
   * @param label The label to find.
   * @param axisType The axis type, either `'x'` or `'y'`.
   * @returns The index of the label from the selected axis labels.
   */
  indexOfAxisLabel(label: string, axisType: 'x' | 'y'): number {
    if (axisType === 'x') {
      return this.xAxis.indexOf(label);
    }

    return this.yAxis.indexOf(label);
  }

  /**
   * @description
   * This function takes an index and tries to return the corresponding label on the x-axis. If the
   * index is out of bounds `null` is returned, otherwise the label is returned.
   *
   * @param index The index of the label to be selected.
   * @returns The x-axis label, if the index is not out of bounds, otherwise `null`.
   */
  getXAxisLabel(index: number): Nullable<string> {
    if (index === -1 || index >= this.size) return null;

    return this.xAxis[index];
  }
}

type Options = {
  start: string;
  end: Nullable<string>;
  milestones: ProjectMilestone[];
  interval: number;
  reportDates?: string[];
};

/**
 * @description
 * This service wraps some functionalities of the ag-charts library. It is possible to define the
 * required chart options through inputting a minimal amount of information.
 */
@Injectable({
  providedIn: 'root'
})
export class AgChartService {
  private chartOptions!: AgChartOptions;

  constructor(private readonly date: DateService) {}

  /**
   * @description
   * This function takes a minimal amount of information about the project and builds the
   * configuration of the chart. The required categories for the axes are generated and the base
   * chart options are populated by the projects data.
   *
   * @param Options.start The official start date of the project.
   * @param Options.end The official end date of the project, if already defined, otherwise `null`.
   * @param Options.milestones An array of milestones assigned to the project.
   * @param Options.interval The report interval for the project.
   * @param Options.reportDates Optionally predefined report dates as a string array.
   */
  defineOptions({
    start,
    end,
    milestones,
    interval,
    reportDates,
  }: Options): void {
    let categories: Categories;

    if (!reportDates || reportDates.length === 0) {
      categories = new Categories(this.date.getReportDates(start, end, interval));
    } else {
      categories = new Categories(reportDates);
    }

    this.chartOptions = {
      background: {
        visible: false,
      },
      title: {
        text: 'Meilensteintrendanalyse',
        textAlign: 'center',
      },
      series: [
        ...(milestones.map((milestone, index) => {
          return {
            type: 'line',
            xKey: 'reportDate',
            yKey: `milestone-${index}`,
            yName: milestone.name,
            strokeWidth: 3,
            marker: {
              shape: 'circle',
              size: 10,
            },
            tooltip: {
              renderer: this.getTooltipRenderer(categories)
            },
          };
        })) as any[],
        {
          type: 'line',
          xKey: 'reportDate',
          yKey: 'targetline',
          yName: 'Ziellinie',
          stroke: '#808080',
          strokeWidth: 3,
          marker: {
            enabled: false,
          },
          tooltip: {
            renderer: this.getTooltipRenderer(categories, '#808080'),
          },
        },
      ],
      data: [],
      legend: {
        enabled: true,
        item: {
          showSeriesStroke: true,
        },
      },
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Berichtszeitpunkte',
          },
          gridLine: {
            style: [
              {
                stroke: 'rgba(219, 219, 219, 1)',
                lineDash: [4, 2],
              },
            ],
          },
        },
        {
          type: 'number',
          position: 'left',
          label: {
            formatter: (params) => {
              return categories.yAxis[params.value];
            },
          },
          tick: {
            values: (new Array(categories.yAxis.length)).fill(0).map((_, i) => i),
          },
          title: {
            text: 'Meilensteinprognosen',
          },
          gridLine: {
            style: [
              {
                stroke: 'rgba(219, 219, 219, 1)',
                lineDash: [4, 2],
              },
            ],
          },
        },
      ],
    };

    categories.yAxis.forEach((reportDate, index) => {
      this.options.data?.push({
        reportDate: categories.getXAxisLabel(index),
        targetline: index,
        ...(milestones.map((milestone, milestoneIndex) => {
          const key = `milestone-${milestoneIndex}`;
          const sqlDate = DateTime.fromFormat(reportDate, 'dd.MM.yyyy').toFormat('yyyy-MM-dd');
          const estimate = milestone.estimates.find((estimate) => estimate.reportDate === sqlDate);

          if (!estimate) return {};

          return {
            [key]: categories.indexOfAxisLabel(
              DateTime.fromSQL(estimate.estimationDate ?? '').toFormat('MM/dd'),
              'x',
            ),
          };
        })).reduce((ack, value) => ({ ...ack, ...value }), {}),
      });
    });
  }

  private getTooltipRenderer(categories: Categories, customColor: string | null = null) {
    return ({ datum, xKey, yKey, color, yName }: AgLineSeriesTooltipRendererParams) => {
      const index = categories.indexOfAxisLabel(datum[xKey], 'x');
      const estimate = `Prognose vom ${categories.yAxis[index]}:`;
      const estimatedDate = categories.yAxis[datum[yKey]];

      return (
        `<div class="ag-chart-tooltip-title" style="background-color:${customColor ?? color}">${yName}</div>` +
        `<div class="ag-chart-tooltip-content">${estimate}<br />${estimatedDate}</div>`
      );
    };
  }

  /**
   * @returns The populated chart options.
   */
  get options(): AgChartOptions {
    return this.chartOptions;
  }

  /**
   * @returns The chart as a base64 image data uri.
   */
  get dataUri$(): Promise<string> {
    return AgCharts.getImageDataURL(
      AgCharts.create(this.options),
      {
        width: 1024,
        height: 768,
      },
    );
  }
}
