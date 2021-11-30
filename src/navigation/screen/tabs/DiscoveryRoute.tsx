import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import HeartScreen from 'feature/discovery/heart/HeartScreen';
import PlusScreen from 'feature/discovery/plus/PlusScreen';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';

const DisStack = createStackNavigator();

const DiscoveryRoute = () => {
    const cardFunctionStyle = {
        backgroundColor: 'transparent',
    };

    return (
        <DisStack.Navigator
            screenOptions={{
                cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
                headerShown: false,
            }}>
            {/* Discovery screen */}
            <DisStack.Screen
                name={DISCOVERY_ROUTE.discoveryScreen}
                component={DiscoveryScreen}
            />

            {/* Heart screen */}
            <DisStack.Screen
                options={{
                    cardStyle: cardFunctionStyle,
                }}
                name={DISCOVERY_ROUTE.heartScreen}
                component={HeartScreen}
            />

            {/* Plus screen */}
            <DisStack.Screen
                options={{
                    cardStyle: cardFunctionStyle,
                }}
                name={DISCOVERY_ROUTE.plusScreen}
                component={PlusScreen}
            />
        </DisStack.Navigator>
    );
};

export default DiscoveryRoute;
