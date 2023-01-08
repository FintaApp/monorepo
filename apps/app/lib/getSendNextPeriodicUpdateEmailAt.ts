import { Frequency } from "@prisma/client";
import moment from "moment-timezone";

export const frequencyToMomentUnit = {
  [Frequency.Daily]: { duration: 'day', of: 'day'},
  [Frequency.Weekly]: { duration: 'week', of: 'isoWeek'},
  [Frequency.Monthly]: { duration: 'month', of: 'month'},
  [Frequency.Quarterly]: { duration: 'quarter', of: 'quarter'},
  [Frequency.Yearly]: { duration: 'year', of: 'year'}
} as Record<Frequency, { duration: moment.unitOfTime.DurationConstructor, of: moment.unitOfTime.StartOf }>;

export const getSendNextPeriodicUpdateEmailAt = ({ frequency, timezone, forceNextDuration }: { frequency: Frequency; timezone: string; forceNextDuration: boolean}) => {
  const { duration, of } = frequencyToMomentUnit[frequency];
  const now = moment().tz(timezone);
  console.log(now.day())
  return now.add(!forceNextDuration && now.hour() < 9 && duration === 'day' ? 0 : 1, duration).startOf(of).hour(9).minute(0).second(0).millisecond(0).toDate()
}