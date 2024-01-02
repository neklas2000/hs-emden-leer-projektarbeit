import { Component, OnInit, ViewChild } from '@angular/core';

import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
};

class Categories {
  private dates: Date[];

  constructor(dates: string[]) {
    this.dates = dates.map((date) => new Date(date));
  }

  get xAxis(): string[] {
    return this.dates.map((date) => date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
    }));
  }

  get yAxis(): string[] {
    return this.dates.map((date) => date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }));
  }

  get size(): number {
    return this.dates.length;
  }
}

@Component({
  selector: 'app-milestone-trend-analysis-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './milestone-trend-analysis-chart.component.html',
  styleUrl: './milestone-trend-analysis-chart.component.scss'
})
export class MilestoneTrendAnalysisChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;

  chartOptions!: ChartOptions;

  ngOnInit(): void {
    this.createChart();
  }

  private createChart() {
    const categories = new Categories([
      '2023-03-07',
      '2023-03-14',
      '2023-03-21',
      '2023-03-28',
      '2023-04-04',
      '2023-04-11',
      '2023-04-18',
      '2023-04-25',
      '2023-05-02',
      '2023-05-09',
      '2023-05-16',
      '2023-05-23',
      '2023-05-30',
    ]);
    const yAxisCategories = categories.yAxis;

    const milestones: ApexAxisChartSeries = [
      {
        name: 'Anforderungen festgelegt',
        data: [4, 4, 4, 4, 4],
      },
      {
        name: 'Hochladen/Analyse der Daten',
        data: [6, 6, 6, 6, 5, 5],
      },
      {
        name: 'Anwendungsdesign festgelegt',
        data: [8, 8, 8, 8, 8, 7, 6],
      },
      {
        name: 'Integration v. Design/Funktionalität',
        data: [10, 10, 10, 10, 10, 10, 10, 9, 8],
      },
      {
        name: 'Abschluss Qualitätssicherung',
        data: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
      },
      {
        name: 'Abgabe Präsentation',
        data: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
      }
    ];

    this.chartOptions = {
      series: [
        {
          name: 'Ziellinie',
          data: (new Array(categories.size)).fill(0).map((value, index, arr) => index),
          color: '#808080'
        },
        ...milestones
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
            color: 'currentColor'
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
    };
  }
}
