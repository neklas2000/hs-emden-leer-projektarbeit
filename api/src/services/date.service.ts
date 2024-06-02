import { Injectable } from '@nestjs/common';

import { DateTime } from 'luxon';

@Injectable()
export class DateService {
	/**
	 * This object contains the representation for one day and one minute in milliseconds.
	 */
	private readonly UNITS = {
		d: 24 * 60 * 60 * 1000,
		m: 60 * 1000,
	};

	/**
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
			.setZone('Europe/Berlin')
			.plus(offset * (this.UNITS[unit] ?? 1))
			.toJSDate();
	}

	/**
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
			.setZone('Europe/Berlin')
			.toFormat('yyyy-MM-dd HH:mm:ss', { locale: 'de-DE' });
	}
}
