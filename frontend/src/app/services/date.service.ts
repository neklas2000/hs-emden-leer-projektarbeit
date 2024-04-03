import { Injectable } from '@angular/core';

import { DateTime, DurationUnits, Interval } from 'luxon';

import { Nullable } from '../types/nullable';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  /**
   * This function returns an array of `DateTime` objects describing the dates on which reports
   * and milestone estimations have to be done. The days between two dates is the same amount as
   * the defined report interval.
   *
   * @param start the date of starting the project (first report date).
   * @param end the date of ending the project (last report date) - default: `null`.
   * @param interval the interval between report dates - default: `7`.
   * @returns an array of report dates.
   */
  getReportDates(start: string, end: Nullable<string> = null, interval: number = 7): DateTime[] {
    const startDate = DateTime.fromSQL(start);
    const endDate = end ? (
      DateTime.fromSQL(end)
    ) : (
      DateTime.fromSQL(start).plus({ days: interval * 13 })
    );

    const dates: string[] = [];

    return Interval.fromDateTimes(startDate, endDate)
      .splitBy({ days: interval })
      .map((date, index, arr) => {
        if (index === arr.length - 1) return [date.start, date.end];

        return [date.start];
      })
      .reduce((previous, current) => {
        previous.push(...current);

        return previous;
      }, [])
      .filter((value) => {
        if (value === null) return false;

        const date = value.toFormat('yyyy-MM-dd');

        if (dates.includes(date)) return false;

        dates.push(date);

        return true;
      }) as DateTime[];
  }

  /**
   * This function evaluates the difference of units between two dates.
   * The format for both dates needs to match 'yyyy-MM-dd'.
   *
   * @param a source date to use for comparison.
   * @param b target date to compare against.
   * @param unit the unit of duration - default: `'days'`.
   * @returns the amount of units between both dates.
   */
  compare(a: string, b: string, unit: DurationUnits = 'days'): number {
    return Object(
      DateTime.fromSQL(a).diff(DateTime.fromSQL(b), unit).toObject()
    )[unit as string];
  }
}
