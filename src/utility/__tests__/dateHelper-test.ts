import { formatServerDate, getDateRangeString, getDateString, getDateTimeRangeString, getFullDateTimeString, getLongDateTimeString, getPaddedDateString, getTimeString, parseServerDate } from '../dateHelper';

const a = new Date('2020-01-02 20:45:00');
const b = new Date('2020-12-31 00:05:01');
const c = new Date('2020-12-31 23:45:01');

it('date string', () => {
  expect(getDateString(a)).toBe('1/2');
});

it('date padded string', () => {
  expect(getPaddedDateString(a)).toBe('01/02');
});

it('date padded year string', () => {
  expect(getPaddedDateString(a, true)).toBe('01/02/2020');
});

it('time string', () => {
  expect(getTimeString(a)).toBe('8:45 PM');
});

it('time string midnight', () => {
  expect(getTimeString(b)).toBe('12:05 AM');
});

it('time string padded', () => {
  expect(getTimeString(a, true)).toBe('08:45 PM');
});

it('date time string', () => {
  expect(getLongDateTimeString(a)).toBe('1/2 8:45 PM');
});

it('full date time string', () => {
  expect(getFullDateTimeString(a)).toBe('01/02/2020 - 08:45 PM');
});

it('date range string', () => {
  expect(getDateRangeString(a, b)).toBe('1/2 - 12/31');
});

it('date time range string', () => {
  expect(getDateTimeRangeString(a, b)).toBe('1/2 8:45 PM - 12/31 12:05 AM');
});

it('date time range string - same day', () => {
  expect(getDateTimeRangeString(b, c)).toBe('12:05 AM - 11:45 PM');
});

it('parseServerDate preserves server wall-clock date and time across offsets', () => {
  const pstMidnight = parseServerDate('2026-11-27T00:00:00-08:00');
  expect(pstMidnight.getFullYear()).toBe(2026);
  expect(pstMidnight.getMonth()).toBe(10);
  expect(pstMidnight.getDate()).toBe(27);
  expect(pstMidnight.getHours()).toBe(0);
  expect(pstMidnight.getMinutes()).toBe(0);
  expect(pstMidnight.getSeconds()).toBe(0);

  const tokyoLate = parseServerDate('2026-11-27T23:30:15.123456+09:00');
  expect(tokyoLate.getFullYear()).toBe(2026);
  expect(tokyoLate.getMonth()).toBe(10);
  expect(tokyoLate.getDate()).toBe(27);
  expect(tokyoLate.getHours()).toBe(23);
  expect(tokyoLate.getMinutes()).toBe(30);
  expect(tokyoLate.getSeconds()).toBe(15);
  expect(tokyoLate.getMilliseconds()).toBe(123);

  const utc = parseServerDate('2026-07-04T09:05:00Z');
  expect(utc.getFullYear()).toBe(2026);
  expect(utc.getMonth()).toBe(6);
  expect(utc.getDate()).toBe(4);
  expect(utc.getHours()).toBe(9);
  expect(utc.getMinutes()).toBe(5);
});

it('formatServerDate emits timezone-naive ISO string', () => {
  const midnight = new Date(2026, 10, 27, 0, 0, 0);
  expect(formatServerDate(midnight)).toBe('2026-11-27T00:00:00');

  const parsed = parseServerDate('2026-07-04T09:05:30-07:00');
  expect(formatServerDate(parsed)).toBe('2026-07-04T09:05:30');
});
