import {GUIDELINE_URL} from 'asset/standardValue';
import StyleWebView from 'components/base/StyleWebView';
import StyleHeader from 'navigation/components/StyleHeader';
import React from 'react';

const NotificationScreen = () => {
    return (
        <>
            <StyleHeader
                title="setting.userGuide.title"
                iconStyle={{width: 0}}
            />
            <StyleWebView source={{uri: GUIDELINE_URL}} />
        </>
    );
};

export default NotificationScreen;
