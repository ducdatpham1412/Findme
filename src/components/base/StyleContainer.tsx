import Redux from 'hook/useRedux';
import StyleHeader, {StyleHeaderProps} from 'navigation/components/StyleHeader';
import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
    KeyboardAwareScrollView,
    KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import {verticalScale} from 'react-native-size-matters';

interface ScrollContainerProps extends KeyboardAwareScrollViewProps {
    children?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<ViewStyle>;
    extraHeight?: number;
    isEffectTabBar?: boolean;
    headerProps?: StyleHeaderProps;
    TopComponent?: ReactNode;
    BottomComponent?: ReactNode;
}

// let offsetY = 0;

const StyleContainer = (props: ScrollContainerProps) => {
    const {
        children,
        containerStyle,
        customStyle,
        extraHeight = verticalScale(120),
        headerProps,
        TopComponent,
        BottomComponent,
    } = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                {flex: 1, backgroundColor: theme.backgroundColor},
                containerStyle,
            ]}>
            {headerProps && <StyleHeader {...headerProps} />}
            {TopComponent}
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
            {BottomComponent}
        </View>
    );
};

export default StyleContainer;
