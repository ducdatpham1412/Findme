import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';

const DisStack = createStackNavigator();

const DiscoveryRoute = () => {
    return (
        <>
            <ViewSafeTopPadding />
            <DisStack.Navigator
                screenOptions={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forFadeFromBottomAndroid,
                    headerShown: false,
                }}>
                <DisStack.Screen
                    name={DISCOVERY_ROUTE.discoveryScreen}
                    component={DiscoveryScreen}
                />
            </DisStack.Navigator>
        </>
    );
};

export default DiscoveryRoute;
