import {StackActions} from '@react-navigation/native';
import {StylePickerProps} from 'components/base/picker/StylePicker';
import ROOT_SCREEN from 'navigation/config/routes';
import React, {ReactNode, RefObject} from 'react';

export const navigationRef: RefObject<any> = React.createRef();

export const navigate = (name: string, params?: {}) => {
    navigationRef.current.navigate(name, params);
};

export const goBack = () => {
    navigationRef.current.goBack();
};

export const push = (name: string, params?: {}) => {
    navigationRef.current.dispatch(StackActions.push(name, params));
};

export const getCurrentRoute = () => {
    return navigationRef.current.getCurrentRoute();
};

interface TypeMoreChoiceAlert {
    actionClickOk?: Function;
    moreNotice?: string;
    moreAction?(): void;
}

interface TypeAlertYesOrNo {
    i18Title: string;
    i18Params?: object;
    agreeChange(): any;
    refuseChange(): any;
    headerNode?: ReactNode;
    displayButton?: boolean;
    touchOutBack?: boolean;
}

export interface TypeSwipeImages {
    listImages: Array<{url: string}>;
    initIndex?: number;
    allowSaveImage?: boolean;
    textSaveImage?: string;
}

export const appAlert = (notice: any, more?: TypeMoreChoiceAlert) => {
    navigate(ROOT_SCREEN.alert, {
        notice: String(notice),
        actionClickOk: more?.actionClickOk,
        moreNotice: more?.moreNotice,
        moreAction: more?.moreAction,
    });
};

export const appAlertYesNo = (params: TypeAlertYesOrNo) => {
    navigate(ROOT_SCREEN.alertYesNo, params);
};

export const showSwipeImages = (params: TypeSwipeImages) => {
    navigate(ROOT_SCREEN.swipeImages, params);
};

export const popUpPicker = (params: StylePickerProps) => {
    navigate(ROOT_SCREEN.picker, params);
};
