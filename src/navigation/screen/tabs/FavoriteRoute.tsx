import DetailGroupBuying from 'feature/discovery/DetailGroupBuying';
import FavoriteScreen from 'feature/favorite/FavoriteScreen';
import {FAVORITE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

const FavoriteRoute = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name={FAVORITE_ROUTE.favoriteScreen}
                component={FavoriteScreen}
            />
            <Stack.Screen
                name={FAVORITE_ROUTE.detailGroupBuying}
                component={DetailGroupBuying}
                sharedElementsConfig={route => {
                    return [`item.group_buying.${route.params.item.id}.false`];
                }}
            />
        </Stack.Navigator>
    );
};

export default FavoriteRoute;
