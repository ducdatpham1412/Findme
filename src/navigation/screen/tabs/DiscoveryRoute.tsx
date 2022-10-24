import {CardStyleInterpolators} from '@react-navigation/stack';
import DetailGroupBuying from 'feature/discovery/DetailGroupBuying';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import SearchScreen from 'feature/discovery/SearchScreen';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

const DiscoveryRoute = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
                headerShown: false,
            }}>
            <Stack.Screen
                name={DISCOVERY_ROUTE.discoveryScreen}
                component={DiscoveryScreen}
            />
            <Stack.Screen
                name={DISCOVERY_ROUTE.detailGroupBuying}
                component={DetailGroupBuying}
                sharedElementsConfig={route => {
                    return [
                        `item.group_buying.${route.params.item.id}.${!!route
                            .params?.isFromTopGroupBuying}`,
                    ];
                }}
            />
            <Stack.Screen
                name={DISCOVERY_ROUTE.searchScreen}
                component={SearchScreen}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
        </Stack.Navigator>
    );
};

export default DiscoveryRoute;
