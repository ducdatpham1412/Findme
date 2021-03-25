import APP_ROUTE from 'navigation/config/routes';
import React, {RefObject} from 'react';

export const navigationRef: RefObject<any> = React.createRef();

export const navigate = (name: string, params?: {}) => {
    navigationRef.current.navigate(name, params);
};

export const goBack = () => {
    navigationRef.current.goBack();
};

export const appAlert = (i18nNotice: string) => {
    navigate(APP_ROUTE.alert, {
        notice: i18nNotice,
    });
};
