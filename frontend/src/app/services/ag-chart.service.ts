import { Injectable } from '@angular/core';

import { AgChartOptions, AgCharts, AgLineSeriesTooltipRendererParams } from 'ag-charts-community';
import { DateTime, Interval } from 'luxon';

import { ProjectMilestone } from '@Models/project-milestone';
import { Nullable } from '@Types';

class Categories {
  private dates: DateTime[];
  private xAxisLabels: string[] | null = null;
  private yAxisLabels: string[] | null = null;

  constructor(dates: string[]) {
    this.dates = dates.map((date) => DateTime.fromSQL(date));
  }

  get xAxis(): string[] {
    if (!this.xAxisLabels) {
      this.xAxisLabels = this.dates.map((date) => date.toFormat('MM/dd'));
    }

    return this.xAxisLabels;
  }

  get yAxis(): string[] {
    if (!this.yAxisLabels) {
      this.yAxisLabels = this.dates.map((date) => date.toFormat('dd.MM.yyyy'));
    }

    return this.yAxisLabels;
  }

  get size(): number {
    return this.dates.length;
  }

  indexOf(date: DateTime): number {
    for (let i = 0; i < this.size; i++) {
      if (this.dates[i].equals(date)) return i;
    }

    return -1;
  }

  indexOfAxisLabel(label: string, type: 'x' | 'y'): number {
    if (type === 'x') {
      return this.xAxis.indexOf(label);
    }

    return this.yAxis.indexOf(label);
  }

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
  chartWidth?: string | number;
  reportDates?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class AgChartService {
  private chartOptions!: AgChartOptions;

  constructor() {}

  defineOptions({
    start,
    end,
    milestones,
    interval,
    chartWidth,
    reportDates,
  }: Options): void {
    let categories: Categories;

    if (!reportDates || reportDates.length === 0) {
      const startDate = DateTime.fromSQL(start);
      const endDate = end ? (
        DateTime.fromSQL(end)
      ) : (
        DateTime.fromSQL(start).plus({ days: interval * 13 })
      );

      const reportInterval = Interval.fromDateTimes(startDate, endDate);

      categories = new Categories(
        reportInterval
          .splitBy({ days: interval })
          .map((date, index, arr) => {
            if (index === arr.length - 1) return [date.start?.toISODate(), date.end?.toISODate()];

            return [date.start?.toISODate()];
          })
          .reduce((previous, current) => {
            previous.push(...current);

            return previous;
          }, [])
          .filter((value, index, arr) => {
            if (value === undefined) return false;

            return arr.indexOf(value) === index;
          }) as string[]
      );
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
        color: 'currentColor',
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
            shape: 'circle',
            fill: '#808080',
            size: 10,
          },
          tooltip: {
            renderer: this.getTooltipRenderer(categories, '#808080'),
          },
        },
      ],
      data: [],
      legend: {
        enabled: true,
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
      const estimate = `Schätzung vom ${categories.yAxis[index]}:`;
      const estimatedDate = categories.yAxis[datum[yKey]];

      return (
        `<div class="ag-chart-tooltip-title" style="background-color:${customColor ?? color}">${yName}</div>` +
        `<div class="ag-chart-tooltip-content">${estimate}<br />${estimatedDate}</div>`
      );
    };
  }

  get options(): AgChartOptions {
    return this.chartOptions;
  }

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
