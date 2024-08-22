import { DateTime } from 'luxon';

import { Nullable } from '@Types';

/**
 * @description
 * This class provides an easier access to all labels required by the x- and y-axis of the chart.
 * In order to reduce the runtime complexity labels will be memorized, once the getter has been
 * called for the first time.
 */
export class ChartCategories {
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
    if (index < 0 || index >= this.size) return null;

    return this.xAxis[index];
  }
}
