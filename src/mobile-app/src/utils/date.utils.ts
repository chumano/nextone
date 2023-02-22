import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';

export const DATETIME_FORMAT = 'HH:mm:ss DD/MM/YYYY';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.locale('vi');

export const frowNow = (dateTime: string, format?: string) => {
  const date = dayjs(dateTime, format || DATETIME_FORMAT);
  if (!date.isValid()) {
    return dateTime;
  }

  const displayDate = date.fromNow();
  return displayDate;
};

export const nowDate = () => {
  return dayjs().format(DATETIME_FORMAT);
};

export const compareDate= (dateTime1:string, dateTime2:string )=>{
  const date1 = dayjs(dateTime1, DATETIME_FORMAT).valueOf();
  const date2 = dayjs(dateTime2, DATETIME_FORMAT).valueOf();

  if(date1 === date2) return 0;

  if(date1 > date2) return 1;
  return -1;
}