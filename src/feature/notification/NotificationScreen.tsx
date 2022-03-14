import {Metrics} from 'asset/metrics';
import {GUIDELINE_URL} from 'asset/standardValue';
import StyleWebView from 'components/base/StyleWebView';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import React from 'react';
import {View} from 'react-native';

const NotificationScreen = () => {
    const theme = Redux.getTheme();

    return (
        <View
            style={{
                flex: 1,
                paddingTop: Metrics.safeTopPadding,
                backgroundColor: theme.backgroundColor,
            }}>
            <StyleHeader
                title="setting.userGuide.title"
                iconStyle={{width: 0}}
            />
            <StyleWebView source={{uri: GUIDELINE_URL}} />
        </View>
    );
};

export default NotificationScreen;
