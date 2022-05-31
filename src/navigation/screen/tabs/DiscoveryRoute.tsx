import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';

const DisStack = createStackNavigator();

const DiscoveryRoute = () => {
    const theme = Redux.getTheme();

    return (
        <DisStack.Navigator
            screenOptions={{
                cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
                headerShown: false,
                cardStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}>
            <DisStack.Screen
                name={DISCOVERY_ROUTE.discoveryScreen}
                component={DiscoveryScreen}
            />
        </DisStack.Navigator>
    );
};

export default DiscoveryRoute;
