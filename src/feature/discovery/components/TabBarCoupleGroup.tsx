import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import {Metrics} from 'asset/metrics';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';

interface Props {
    materialProps: MaterialTopTabBarProps;
}
// personal - community
const listIcon = [
    'discovery.discoveryScreen.personal',
    'discovery.discoveryScreen.community',
];

const TabBarCoupleGroup = (props: Props) => {
    const {materialProps} = props;
    const {state, navigation, position} = materialProps;
    const {t} = useTranslation();

    const theme = Redux.getTheme();

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                {state.routes.map((route, index) => {
                    const label = listIcon?.[index];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });

                        if (!isFocused) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    // modify inputRange for custom behavior
                    const inputRange = state.routes.map((_, i) => i);
                    const opacity = position.interpolate({
                        inputRange,
                        outputRange: inputRange.map(i =>
                            i === index ? 1 : 0.4,
                        ),
                    });

                    return (
                        <>
                            <StyleTouchable
                                accessibilityState={
                                    isFocused ? {selected: true} : {}
                                }
                                // accessibilityLabel={options.tabBarAccessibilityLabel}
                                // testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.buttonView}>
                                <Animated.Text
                                    style={[
                                        styles.iconLabel,
                                        {opacity, color: theme.textHightLight},
                                    ]}>
                                    {t(label)}
                                </Animated.Text>
                            </StyleTouchable>

                            {index === 0 && (
                                <View
                                    style={[
                                        styles.divider,
                                        {backgroundColor: theme.borderColor},
                                    ]}
                                />
                            )}
                        </>
                    );
                })}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        zIndex: 2,
        alignSelf: 'center',
        top: Metrics.safeTopPadding + verticalScale(10),
    },
    buttonView: {
        alignItems: 'center',
    },
    iconLabel: {
        fontSize: '15@ms',
        color: 'white',
        fontWeight: 'bold',
    },
    divider: {
        width: '1@ms',
        height: '100%',
        backgroundColor: 'red',
        marginHorizontal: '15@s',
    },
});

export default TabBarCoupleGroup;
