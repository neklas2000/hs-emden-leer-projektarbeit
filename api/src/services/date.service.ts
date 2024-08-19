import { Injectable } from '@nestjs/common';

import { DateTime } from 'luxon';

const TIME_ZONE = 'Europe/Berlin';

@Injectable()
export class DateService {
	/**
	 * @description
	 * This object contains the representation for one day and one minute in milliseconds.
	 */
	private readonly UNITS = {
		d: 24 * 60 * 60 * 1000,
		m: 60 * 1000,
	};

	/**
	 * @description
	 * This function takes one argument representing an offset and a time unit which will be used
	 * to increment the current timestamp. For example, it can be used to get an expiration date for
	 * the access token which would be used as follows:
	 *
	 * ```ts
	 * const date = new DateService();
	 * // This line of code will get a date 30 minutes ahead of time as a JavaScript date object
	 * const accessTokenExpiration = date.getExpirationDateWithOffset('30m');
	 * ```
	 *
	 * @param offsetWithUnit The offset and the time unit - eg. 30m ~> meaning 30 minutes.
	 * @returns A javascript Date of the current time incremented by the given offset.
	 */
	getExpirationDateWithOffset(offsetWithUnit: string): Date {
		const regex = new RegExp(/\d*/);
		const offset = parseInt(regex.exec(offsetWithUnit)[0]);
		const unit = offsetWithUnit.replace(offset.toString(), '');

		return DateTime.local()
			.setZone(TIME_ZONE)
			.plus(offset * (this.UNITS[unit] ?? 1))
			.toJSDate();
	}

	/**
	 * @description
	 * This function takes one argument representing an offset and a time unit which will be used
	 * to increment the current timestamp. It wraps the function `getExpirationDateWithOffset` and
	 * returns the value as a string. For example, it can be used to get an expiration date for
	 * the access token which would be used as follows:
	 *
	 * ```ts
	 * const date = new DateService();
	 * // This line of code will get a date 30 minutes ahead of time in the following format:
	 * // yyyy-MM-dd HH:mm:ss ~> example timestamp: 2024-05-30 15:37:28
	 * const accessTokenExpiration = date.getCurrentTimestampWithOffset('30m');
	 * ```
	 *
	 * @param offsetWithUnit The offset and the time unit - eg. 30m ~> meaning 30 minutes.
	 * @returns A string of the current timestamp incremented by the given offset and time unit.
	 */
	getCurrentTimestampWithOffset(offsetWithUnit: string): string {
		const jsDate = this.getExpirationDateWithOffset(offsetWithUnit);

		return DateTime.fromJSDate(jsDate)
			.setZone(TIME_ZONE)
			.toFormat('yyyy-MM-dd HH:mm:ss', { locale: 'de-DE' });
	}

	/**
	 * @description
	 * This function checks if the given timestamp is after the current time. It can be used to
	 * validate an authorization token so that it has not yet expired.
	 *
	 * @param timestamp The timestamp to check if it's behind the current time.
	 * @returns `true` if it's behind the current time, otherwise `false`
	 */
	isAfterCurrentTimestamp(timestamp: string | Date): boolean {
		let date: string;

		if (timestamp instanceof Date) {
			date = DateTime.fromJSDate(timestamp)
				.setZone(TIME_ZONE)
				.toFormat('yyyy-MM-dd HH:mm:ss', { locale: 'de-DE' });
		} else {
			date = timestamp;
		}

		const given = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss', {
			locale: 'de-DE',
		}).setZone(TIME_ZONE);
		const now = DateTime.fromFormat(
			this.getCurrentTimestampWithOffset('0m'),
			'yyyy-MM-dd HH:mm:ss',
			{ locale: 'de-DE' },
		).setZone(TIME_ZONE);

		return given.diff(now).toObject().milliseconds > 0;
	}

	/**
	 * @description
	 * This function takes a javascript date object as input and parses it to be a string with the
	 * format 'yyyy-MM-dd'.
	 *
	 * @param date The date to be parsed.
	 * @returns The parsed date in the format 'yyyy-MM-dd'.
	 */
	parseDate(date: Date): string {
		return DateTime.fromJSDate(date).setZone(TIME_ZONE).toFormat('yyyy-MM-dd');
	}
}
