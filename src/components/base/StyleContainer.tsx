import Redux from 'hook/useRedux';
import React, {ReactNode} from 'react';
import {ScrollViewProps, StyleProp, View, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {verticalScale} from 'react-native-size-matters';

interface ScrollContainerProps extends ScrollViewProps {
    children?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<ViewStyle>;
    extraHeight?: number;
    isEffectTabBar?: boolean;
}

// let offsetY = 0;

const StyleContainer = (props: ScrollContainerProps) => {
    const {
        children,
        containerStyle,
        customStyle,
        extraHeight = verticalScale(120),
    } = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                {flex: 1, backgroundColor: theme.backgroundColor},
                containerStyle,
            ]}>
            <KeyboardAwareScrollView
                contentContainerStyle={[
                    {width: '100%', minHeight: '100%'},
                    customStyle,
                ]}
                scrollEnabled={false}
                extraHeight={extraHeight}
                extraScrollHeight={extraHeight}
                enableOnAndroid
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                {...props}>
                {children}
            </KeyboardAwareScrollView>
        </View>
    );
};

export default StyleContainer;
