/* eslint-disable react-native/no-inline-styles */
import useRedux from 'hook/useRedux';
import {useTabBar} from 'navigation/config/TabBarProvider';
import React, {ReactNode} from 'react';
import {ScrollViewProps, StyleProp, View, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface ScrollContainerProps extends ScrollViewProps {
    children?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<any>;
    extraHeight?: number;
    isEffectTabBar?: boolean;
}

let offsetY = 0;

const StyleContainer = (props: ScrollContainerProps) => {
    const {
        children,
        containerStyle,
        customStyle,
        extraHeight = 120,
        isEffectTabBar = true,
    } = props;
    const theme = useRedux().getTheme();

    const {setShowTabBar} = useTabBar();

    const onScroll = () => {
        if (isEffectTabBar) {
            return ({nativeEvent}: any) => {
                const newOffset = nativeEvent.contentOffset.y;
                offsetY < newOffset
                    ? setShowTabBar(false)
                    : setShowTabBar(true);
                offsetY = newOffset;
            };
        }
        return () => null;
    };

    return (
        <View
            style={[
                {flex: 1, backgroundColor: theme.backgroundColor},
                containerStyle,
            ]}>
            <KeyboardAwareScrollView
                contentContainerStyle={[
                    customStyle,
                    {width: '100%', minHeight: '100%'},
                ]}
                scrollEnabled={false}
                extraHeight={extraHeight}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScroll={onScroll()}
                {...props}>
                {children}
            </KeyboardAwareScrollView>
        </View>
    );
};

export default StyleContainer;
