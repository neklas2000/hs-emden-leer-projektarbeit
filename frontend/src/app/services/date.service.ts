import { Injectable } from '@angular/core';

import { DateTime, DurationUnits, Interval } from 'luxon';

import { ZONE } from '@Constants';
import { Nullable } from '@Types';

/**
 * @description
 * This service provides functions for date manipulations. It is possible to get the current date
 * as a `DateTime` object (from the library "luxon"), to get the difference between to dates as a
 * comparison and to get a list of report dates which can be used for rendering the milestone trend
 * analysis chart.
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {
  /**
   * @description
   * This function returns the current date as a `DateTime` object compliant to the timezone
   * Europe/Berlin.
   *
   * @returns The `DateTime` object.
   */
  getToday(): DateTime {
    return DateTime.fromSQL(DateTime.local().setZone(ZONE).toFormat('yyyy-MM-dd'));
  }

  /**
   * @description
   * This function returns an array of `DateTime` objects describing the dates on which reports
   * and milestone estimations have to be done. The days between two dates is the same amount as
   * the defined report interval.
   *
   * @param start The date of starting the project (first report date).
   * @param end The date of ending the project (last report date) - default: `null`.
   * @param interval The interval between report dates - default: `7`.
   * @returns An array of report dates.
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
   * @description
   * This function evaluates the difference of units between two dates. The expected format for both
   * dates needs to match 'yyyy-MM-dd'.
   *
   * @param source Source date to use for comparison.
   * @param target Target date to compare against.
   * @param unit The unit of duration - default: `'days'`.
   * @returns The amount of units between both dates.
   */
  compare(
    source: Nullable<string>,
    target: Nullable<string>,
    unit: DurationUnits = 'days',
  ): number {
    if (!source || !target) return 0;

    return Object(
      DateTime.fromSQL(source).diff(DateTime.fromSQL(target), unit).toObject(),
    )[unit as string];
  }
}
