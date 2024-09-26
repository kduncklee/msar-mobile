import { getDateRangeString, getDateString, getDateTimeRangeString, getFullDateTimeString, getLongDateTimeString, getPaddedDateString, getTimeString } from '../dateHelper';

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
