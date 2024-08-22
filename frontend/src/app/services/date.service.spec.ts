import { TestBed } from '@angular/core/testing';

import { DateService } from '@Services/date.service';
import { DateTime } from 'luxon';

describe('Service: DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getToday(): DateTime', () => {
    it('should return the current Date', () => {
      jasmine.clock().install().mockDate(DateTime.fromSQL('2024-01-01').toJSDate());

      expect(service.getToday().toFormat('yyyy-MM-dd')).toEqual('2024-01-01');

      jasmine.clock().uninstall();
    });
  });

  describe('getReportDates(string, Nullable<string>?, number?): DateTime[]', () => {
    it('should return an array of DateTime objects for thirteen dates in an interval', () => {
      const reportDates = service.getReportDates('2024-01-01');

      expect(reportDates.length).toBe(14);
      expect(reportDates[0].toFormat('yyyy-MM-dd')).toEqual('2024-01-01');
      expect(reportDates[1].toFormat('yyyy-MM-dd')).toEqual('2024-01-08');
      expect(reportDates[2].toFormat('yyyy-MM-dd')).toEqual('2024-01-15');
      expect(reportDates[3].toFormat('yyyy-MM-dd')).toEqual('2024-01-22');
      expect(reportDates[4].toFormat('yyyy-MM-dd')).toEqual('2024-01-29');
      expect(reportDates[5].toFormat('yyyy-MM-dd')).toEqual('2024-02-05');
      expect(reportDates[6].toFormat('yyyy-MM-dd')).toEqual('2024-02-12');
      expect(reportDates[7].toFormat('yyyy-MM-dd')).toEqual('2024-02-19');
      expect(reportDates[8].toFormat('yyyy-MM-dd')).toEqual('2024-02-26');
      expect(reportDates[9].toFormat('yyyy-MM-dd')).toEqual('2024-03-04');
      expect(reportDates[10].toFormat('yyyy-MM-dd')).toEqual('2024-03-11');
      expect(reportDates[11].toFormat('yyyy-MM-dd')).toEqual('2024-03-18');
      expect(reportDates[12].toFormat('yyyy-MM-dd')).toEqual('2024-03-25');
      expect(reportDates[13].toFormat('yyyy-MM-dd')).toEqual('2024-04-01');
    });

    it('should return the interval between two dates', () => {
      const reportDates = service.getReportDates('2024-01-01', '2024-01-05', 1);

      expect(reportDates.length).toBe(5);
      expect(reportDates[0].toFormat('yyyy-MM-dd')).toEqual('2024-01-01');
      expect(reportDates[1].toFormat('yyyy-MM-dd')).toEqual('2024-01-02');
      expect(reportDates[2].toFormat('yyyy-MM-dd')).toEqual('2024-01-03');
      expect(reportDates[3].toFormat('yyyy-MM-dd')).toEqual('2024-01-04');
      expect(reportDates[4].toFormat('yyyy-MM-dd')).toEqual('2024-01-05');
    });
  });

  describe('compare(Nullable<string>, Nullable<string>, DurationUnits?): number', () => {
    it('should return zero since the source was null', () => {
      expect(service.compare(null, '2024-01-01')).toBe(0);
    });

    it('should return zero since the target was null', () => {
      expect(service.compare('2024-01-01', null)).toBe(0);
    });

    it('should return the difference between two dates in days', () => {
      expect(service.compare('2024-01-08', '2024-01-01')).toBe(7);
    });
  });

  describe('isWithinInterval(string | DateTime, number, string | DateTime, Nullable<string | DateTime>): boolean', () => {
    it('should return true, because the given date is within the interval', () => {
      expect(service.isWithinInterval('2024-01-08', 7, '2024-01-01', '2024-01-15')).toBeTruthy();
    });

    it('should return true, because the given date is within the interval (dates given in DateTime objects)', () => {
      expect(service.isWithinInterval(
        DateTime.fromSQL('2024-01-08'),
        7,
        DateTime.fromSQL('2024-01-01'),
        DateTime.fromSQL('2024-01-15'),
      )).toBeTruthy();
    });

    it('should return false, because the date differnece does not match the interval', () => {
      expect(service.isWithinInterval('2024-01-08', 7, '2024-01-02', null)).toBeFalsy();
    });

    it('should return true, because the date differnece does match the interval but an end date was not provided', () => {
      expect(service.isWithinInterval('2024-01-08', 7, '2024-01-01', null)).toBeTruthy();
    });
  });

  describe('getNextDateInInterval(string | DateTime, number): string', () => {
    it('should return the next date in an interval from a DateTime object', () => {
      expect(service.getNextDateInInterval(DateTime.fromSQL('2024-01-01'), 7)).toEqual('2024-01-08');
    });

    it('should return the next date in an interval from a string literal', () => {
      expect(service.getNextDateInInterval('2024-01-07', 7)).toEqual('2024-01-14');
    });
  });

  describe('toString(string | DateTime): string', () => {
    it('should turn a DateTime object into a string', () => {
      expect(service.toString(DateTime.fromSQL('2024-01-01'))).toEqual('2024-01-01');
    });

    it('should just return the argument, since it was always of the type string', () => {
      expect(service.toString('01.01.2024')).toEqual('01.01.2024');
    });
  });
});
