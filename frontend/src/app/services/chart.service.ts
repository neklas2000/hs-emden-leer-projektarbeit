import { Injectable } from '@angular/core';

import { DateTime, Interval } from 'luxon';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import ApexCharts from 'apexcharts';

import { ProjectMilestone } from '@Models/project-milestone';
import { Nullable } from '@Types';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
};

type Options = {
  start: string;
  end: Nullable<string>;
  milestones: ProjectMilestone[];
  interval: number;
  chartWidth?: string | number;
  reportDates?: string[];
};

class Categories {
  private dates: DateTime[];

  constructor(dates: string[]) {
    this.dates = dates.map((date) => DateTime.fromSQL(date));
  }

  get xAxis(): string[] {
    return this.dates.map((date) => date.toFormat('MM/dd'));
  }

  get yAxis(): string[] {
    return this.dates.map((date) => date.toFormat('dd.MM.yyyy'));
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

export class FreeMarkers {
  freeMarkers!: number[][];
  categories!: Categories;

  constructor(categories?: Categories) {
    if (categories) {
      this.categories = categories;
      this.freeMarkers = new Array(categories.size).fill([]);
      const rowNumbers = (new Array(categories.size))
        .fill(0)
        .map((value, index) => index);

      rowNumbers.forEach((index) => this.freeMarkers[index] = rowNumbers.slice(index));
    }
  }

  remove(xAxisIndex: number, rowIndex: number): void {
    if (xAxisIndex === -1) return;

    const rowNumbers = this.freeMarkers[xAxisIndex] || [];
    const index = rowNumbers.indexOf(rowIndex);

    if (index > -1) {
      this.freeMarkers[xAxisIndex].splice(index, 1);
    }
  }

  dropColumn(xAxisIndex: number): void {
    this.freeMarkers[xAxisIndex] = [];
  }

  get markers(): Map<Nullable<string>, number[]> {
    const map = new Map<Nullable<string>, number[]>();

    this.freeMarkers.forEach((value, index) => {
      map.set(this.categories.getXAxisLabel(index), value);
    });

    return map;
  }

  clone(): FreeMarkers {
    const cloned = new FreeMarkers();
    cloned.freeMarkers = new Array(this.freeMarkers.length).fill([]);

    this.freeMarkers.forEach((value, index) => {
      cloned.freeMarkers[index] = value.slice();
    });

    cloned.categories = this.categories;

    return cloned;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chartOptions!: ChartOptions;
  private freeMarkers!: FreeMarkers;

  constructor() { }

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

    this.freeMarkers = new FreeMarkers(categories);

    const yAxisCategories = categories.yAxis;
    const milestoneSeries: ApexAxisChartSeries = milestones.map((milestone) => {
      const data: number[] = [];

      if (milestone.estimates.length === 0) {
        data.push(categories.size - 1);
      } else {
        const estimates = milestone.estimates.sort((estimateA, estimateB) => {
          return DateTime.fromSQL(estimateA.reportDate)
            .diff(DateTime.fromSQL(estimateB.reportDate), 'days').days;
        });

        for (let i = 0; i < estimates.length; i++) {
          const yIndex = categories.indexOf(DateTime.fromSQL(estimates[i].estimationDate || ''));
          data.push(yIndex);

          if (estimates[i].milestoneReached) break;
        }
      }

      return {
        name: milestone.name,
        data,
      };
    });

    const targetLineData = (new Array(categories.size))
      .fill(0)
      .map((value, index) => index);

    for (const index of targetLineData) {
      this.freeMarkers.remove(index, index);
    }

    this.chartOptions = {
      series: [
        {
          name: 'Ziellinie',
          data: targetLineData,
          color: '#808080',
        },
        ...milestoneSeries,
      ],
      chart: {
        animations: {
          enabled: false,
        },
        foreColor: 'currentColor',
        type: 'line',
        height: 'auto',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        ...(chartWidth ? { width: chartWidth } : {}),
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: 'Meilensteintrendanalyse',
        align: 'center',
        style: {
          color: 'currentColor',
        },
      },
      grid: {
        borderColor: '#969696',
        row: {
          colors: ['#ffffcc'],
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: categories.xAxis,
        title: {
          text: 'Berichtszeitpunkte',
          style: {
            color: 'currentColor',
          },
        },
        labels: {
          style: {
            colors: 'currentColor',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val, opts) => {
            return yAxisCategories[val];
          },
          style: {
            colors: 'currentColor',
          },
        },
        title: {
          text: 'Meilensteinprognosen',
          style: {
            color: 'currentColor',
          },
        },
        tickAmount: categories.size,
      },
      markers: {
        size: [4],
      },
      tooltip: {
        intersect: true,
        shared: false,
      },
    };
  }

  get options(): ChartOptions {
    return this.chartOptions;
  }

  get markerPoints(): FreeMarkers {
    return this.freeMarkers;
  }

  get dataUri$(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const chart = new ApexCharts(div, this.chartOptions);

      try {
        await chart.render();
        const data = await chart.dataURI();

        resolve((data as any).imgURI);
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(div);
      }
    });
  }
}
