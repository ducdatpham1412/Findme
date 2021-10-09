import APP_ROUTE from 'navigation/config/routes';
import React, {ReactNode, RefObject} from 'react';

export const navigationRef: RefObject<any> = React.createRef();

export const navigate = (name: string, params?: {}) => {
    navigationRef.current.navigate(name, params);
};

export const goBack = () => {
    navigationRef.current.goBack();
};

export const appAlert = (
    notice: any,
    more?: {
        actionClickOk?: Function;
        moreNotice?: string;
        moreAction?(): void;
    },
) => {
    navigate(APP_ROUTE.alert, {
        notice: String(notice),
        actionClickOk: more?.actionClickOk,
        moreNotice: more?.moreNotice,
        moreAction: more?.moreAction,
    });
};

export const appAlertYesNo = (params: {
    i18Title: string;
    i18Params?: object;
    agreeChange(): any;
    refuseChange(): any;
    headerNode?: ReactNode;
}) => {
    navigate(APP_ROUTE.alertYesNo, params);
};
