import { Injectable } from '@nestjs/common';

import { DateTime } from 'luxon';

import { DATETIME_FORMAT, ISO_FORMAT, LOCALE, TIME_ZONE } from '@Common/constants';

@Injectable()
export class DateService {
	/**
	 * @description
	 * This object contains the representation for one day, one hour, one minute,
	 * one second and one millisecond in milliseconds.
	 */
	private readonly UNITS = {
		d: 24 * 60 * 60 * 1000,
		h: 60 * 60 * 1000,
		m: 60 * 1000,
		s: 1000,
		ms: 1,
	};

	withOffset(offsetWithUnit: string, baseDate?: Date): Date {
		let date: DateTime<true | false> = DateTime.local();
		const regex = new RegExp(/\d*/);
		const offset = parseInt(regex.exec(offsetWithUnit)[0]);
		const unit = offsetWithUnit.replace(offset.toString(), '');

		if (baseDate) {
			date = DateTime.fromJSDate(baseDate);
		}

		return date
			.setZone(TIME_ZONE)
			.plus(offset * (this.UNITS[unit] ?? 1))
			.toJSDate();
	}

	withOffsetAsString(offsetWithUnit: string, baseDate?: Date): string {
		const jsDate = this.withOffset(offsetWithUnit, baseDate);

		return DateTime.fromJSDate(jsDate).setZone(TIME_ZONE).toFormat(DATETIME_FORMAT, LOCALE);
	}

	now(): Date {
		return DateTime.local().setZone(TIME_ZONE).toJSDate();
	}

	nowAsString(): string {
		return DateTime.local().setZone(TIME_ZONE).toFormat(DATETIME_FORMAT, LOCALE);
	}

	isAfterCurrentDateTime(datetime: string | Date): boolean {
		let date: string;

		if (datetime instanceof Date) {
			date = DateTime.fromJSDate(datetime).setZone(TIME_ZONE).toFormat(DATETIME_FORMAT, LOCALE);
		} else {
			date = datetime;
		}

		const given = DateTime.fromFormat(date, DATETIME_FORMAT, LOCALE).setZone(TIME_ZONE);
		const now = DateTime.fromFormat(this.nowAsString(), DATETIME_FORMAT, LOCALE).setZone(TIME_ZONE);

		return given.diff(now).toObject().milliseconds > 0;
	}

	toISO(date: Date): string {
		return DateTime.fromJSDate(date).setZone(TIME_ZONE).toFormat(ISO_FORMAT);
	}
}
