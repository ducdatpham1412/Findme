import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import HeartScreen from 'feature/discovery/heart/HeartScreen';
import OtherDisProfile from 'feature/discovery/OtherDisProfile';
import PlusScreen from 'feature/discovery/plus/PlusScreen';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {selectBgCardStyle} from 'utility/assistant';

const DisStack = createStackNavigator();

const DiscoverScreen = () => {
    const theme = Redux.getTheme();

    const cardFunctionStyle: any = [
        styles.cardFunctionStyle,
        {
            borderColor: theme.borderColor,
            backgroundColor: selectBgCardStyle(),
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
                    cardStyle: cardFunctionStyle,
                }}
                name={DISCOVERY_ROUTE.plusScreen}
                component={PlusScreen}
            />

            {/* Other Discovery Profile */}
            <DisStack.Screen
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
                name={DISCOVERY_ROUTE.otherDisProfile}
                component={OtherDisProfile}
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
        transform: [{translateY: Metrics.height / 5}],
    },
});

export default DiscoverScreen;
