import {typeMessage} from 'asset/name';
import I18Next from './I18Next';

export const requireField = () => {
    return () => I18Next.t('alert.require');
};

export const requireLength = (min: number, max: number) => {
    return () => I18Next.t('alert.minLength', {min, max});
};

export const formateMessage = (item: any) => {
    return {
        _id: item?.createdIn || item?._id,
        messageType: item?.messageType,
        text: item?.messageType === typeMessage.text && item?.body,
        image: item?.messageType === typeMessage.image && item?.image,
        image50x50: item?.messageType === typeMessage.image && item?.image50x50,
        image400x400:
            item?.messageType === typeMessage.image && item?.image400x400,
        createdAt: item?.createdIn,
        user: {
            _id: 2,
        },
    };
};
