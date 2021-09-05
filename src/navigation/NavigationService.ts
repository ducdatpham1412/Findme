import APP_ROUTE from 'navigation/config/routes';
import React, {RefObject} from 'react';

export const navigationRef: RefObject<any> = React.createRef();

export const navigate = (name: string, params?: {}) => {
    navigationRef.current.navigate(name, params);
};

export const goBack = () => {
    navigationRef.current.goBack();
};

export const appAlert = (notice: any, actionClickOk?: Function) => {
    navigate(APP_ROUTE.alert, {
        notice: String(notice),
        actionClickOk: actionClickOk,
    });
};

export const appAlertYesNo = (params: {
    i18Title: string;
    i18Params?: object;
    agreeChange(): any;
    refuseChange(): any;
}) => {
    navigate(APP_ROUTE.alertYesNo, params);
};
