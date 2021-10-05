
import moment from 'moment';

export const displayHumanTime = (dateOrTimestamp: Date | number) => {
    const now = new Date();
    const diff = moment(now).diff(dateOrTimestamp, "minutes");
    return moment.duration(diff, "minutes").humanize();
}

export const randomDate = (start?: Date, end?: Date) => {
    if(!start) start = new Date(2020,0,1);
    if(!end) end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}