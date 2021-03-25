import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import HeartScreen from 'feature/discovery/heart/HeartScreen';
import PlusScreen from 'feature/discovery/plus/PlusScreen';
import useRedux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {Dimensions} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {selectBgCardStyle} from 'utility/assistant';

const DisStack = createStackNavigator();
const {height} = Dimensions.get('screen');

const DiscoverScreen = () => {
    const theme = useRedux().getTheme();

    const cardFunctionStyle: any = [
        styles.cardFunctionStyle,
        {
            borderColor: theme.borderColor,
            backgroundColor: selectBgCardStyle(theme),
        },
    ];

    return (
        <DisStack.Navigator
            screenOptions={{
                cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
                headerShown: false,
            }}>
            {/* MAIN DISCOVERY */}
            <DisStack.Screen
                name={DISCOVERY_ROUTE.discoveryScreen}
                component={DiscoveryScreen}
            />

            {/* HEART SCREEN */}
            <DisStack.Screen
                options={{
                    cardStyle: cardFunctionStyle,
                }}
                name={DISCOVERY_ROUTE.heartScreen}
                component={HeartScreen}
            />

            {/* PLUS SCREEN */}
            <DisStack.Screen
                options={{
                    cardOverlayEnabled: true,
                    cardStyle: cardFunctionStyle,
                }}
                name={DISCOVERY_ROUTE.plusScreen}
                component={PlusScreen}
            />
        </DisStack.Navigator>
    );
};

const styles = ScaledSheet.create({
    cardFunctionStyle: {
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderTopLeftRadius: '20@vs',
        borderTopRightRadius: '20@vs',
        transform: [{translateY: height / 5}],
    },
});

export default DiscoverScreen;
