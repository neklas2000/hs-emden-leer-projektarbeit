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
      }, []) as DateTime[];
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

  /**
   * @description
   * This function checks if a given date is within the report interval, taking the start and
   * optionally the end date into account.
   *
   * @param date The date to check if it's within the interval.
   * @param interval The report interval.
   * @param start The start date from which to check if the date is within the interval.
   * @param end Optionally the end date of the interval to make sure the date didn't surpass it.
   * @returns `true` if the date is within the interval, otherwise `false`.
   */
  isWithinInterval(
    date: string | DateTime,
    interval: number,
    start: string | DateTime,
    end: Nullable<string | DateTime>,
  ): boolean {
    if (date instanceof DateTime) {
      date = date.toFormat('yyyy-MM-dd');
    }

    if (start instanceof DateTime) {
      start = start.toFormat('yyyy-MM-dd');
    }

    if (end !== null && end instanceof DateTime) {
      end = end.toFormat('yyyy-MM-dd');
    }

    const diff = this.compare(date, start);
    if (diff < 0 || diff % interval !== 0) return false;
    if (!end) return true;

    return this.compare(date, end) <= 0;
  }

  /**
   * @description
   * This function takes a start date and the report interval. It adds the interval in days onto to
   * the start date and returns the new date in the format 'yyyy-MM-dd'.
   *
   * @param start The start date on which the report interval will be added in days.
   * @param interval The report interval to get the next date of the interval.
   * @returns The next valid date in the report interval in the format 'yyyy-MM-dd'.
   */
  getNextDateInInterval(start: string | DateTime, interval: number): string {
    if (typeof start === 'string') start = DateTime.fromSQL(start);

    return start.plus({ days: interval }).toFormat('yyyy-MM-dd');
  }

  /**
   * @description
   * This function takes a date either as a string or as a `DateTime` object. In case the date is
   * a `DateTime` object, it will be transformed to the format 'yyyy-MM-dd'.
   *
   * @param date The date either as a string or as a `DateTime` object.
   * @returns The date as a string in the format 'yyyy-MM-dd'.
   */
  toString(date: string | DateTime): string {
    if (date instanceof DateTime) return date.toFormat('yyyy-MM-dd');

    return date;
  }
}
