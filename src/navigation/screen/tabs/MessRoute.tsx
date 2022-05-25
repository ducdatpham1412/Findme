import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import MessScreen from 'feature/mess/MessScreen';
import Redux from 'hook/useRedux';
import {MESS_ROUTE} from 'navigation/config/routes';
import React, {useEffect} from 'react';

const MessStack = createStackNavigator();

const MessRoute = () => {
    const theme = Redux.getTheme();

    useEffect(() => {
        Redux.setBorderMessRoute(theme.borderColor);
    }, []);

    return (
        <MessStack.Navigator
            // initialRouteName={MESS_ROUTE.publicChatting}
            screenOptions={{
                cardStyle: [
                    {
                        backgroundColor: theme.backgroundColor,
                    },
                ],
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <MessStack.Screen
                name={MESS_ROUTE.messScreen}
                component={MessScreen}
            />
        </MessStack.Navigator>
    );
};

export default MessRoute;
