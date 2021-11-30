import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import I18Next from './I18Next';

dayjs.extend(relativeTime);
dayjs.locale('en');
dayjs.extend(utc);
dayjs.extend(isToday);

export const requireField = () => {
    return () => I18Next.t('alert.require');
};

export const requireLength = (min: number, max: number) => {
    return () => I18Next.t('alert.minLength', {min, max});
};

export const formatUTCDate = (date: string | Date) => {
    return dayjs(date, 'YYYY-MM-DD HH:mm:ss').utc();
};

export const formatSecondToNow = (date: Date) => {
    return dayjs(date).fromNow();
};

export const checkIsToday = (date: string | Date) => {
    return dayjs(date).isToday();
};

export const formatDateMessage = (date: string | Date) => {
    if (checkIsToday(date)) {
        return dayjs(date).locale('en').format('HH:mm');
    }
    return dayjs(date).locale('en').format('MMM DD, HH:mm');
};
