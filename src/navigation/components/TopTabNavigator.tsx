import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    materialProps: MaterialTopTabBarProps;
    listRouteName?: Array<string>;
    listRouteParams?: Array<object>;
    // length of listRouteName, listRouteParams must be equal to state.routes
}

const TopTabNavigator = (props: Props) => {
    const {
        materialProps,
        listRouteName = props.materialProps.state.routeNames,
        listRouteParams,
    } = props;
    const {state, navigation, position} = materialProps;

    const theme = Redux.getTheme();

    const [containerWidth, setContainerWidth] = useState(0);
    const numberTabs = state.routes.length;
    const indicatorWidth = containerWidth / numberTabs;

    const translateX = position.interpolate({
        inputRange: state.routes.map((_, i) => i),
        outputRange: [0, indicatorWidth * (numberTabs - 1)],
    });

    return (
        <View style={{backgroundColor: theme.backgroundColor}}>
            <View
                style={styles.container}
                onLayout={({nativeEvent}) =>
                    setContainerWidth(nativeEvent.layout.width)
                }>
                {state.routes.map((route, index) => {
                    // const {options} = descriptors[route.key];
                    const label = listRouteName?.[index];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });

                        if (!isFocused) {
                            navigation.navigate(
                                route.name,
                                listRouteParams?.[index] ||
                                    state.routes[index].params,
                            );
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
                                    styles.titleText,
                                    {opacity, color: theme.textColor},
                                ]}>
                                {label}
                            </Animated.Text>
                        </StyleTouchable>
                    );
                })}
            </View>

            <Animated.View
                style={{
                    width: indicatorWidth,
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.borderColor,
                    transform: [{translateX}],
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: '10@vs',
    },
    titleText: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
});

export default TopTabNavigator;