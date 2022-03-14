import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import ChatDetail from 'feature/mess/ChatDetail';
import ChatDetailSetting from 'feature/mess/ChatDetailSetting';
import MessScreen from 'feature/mess/MessScreen';
import PublicChatting from 'feature/mess/PublicChatting';
import Redux from 'hook/useRedux';
import {MESS_ROUTE} from 'navigation/config/routes';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

const MessStack = createStackNavigator();

const MessRoute = () => {
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    useEffect(() => {
        Redux.setBorderMessRoute(theme.borderColor);
    }, []);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    paddingTop: Metrics.safeTopPadding,
                },
            ]}>
            <MessStack.Navigator
                // initialRouteName={MESS_ROUTE.publicChatting}
                screenOptions={{
                    cardStyle: [
                        {
                            backgroundColor: 'transparent',
                        },
                    ],
                    headerShown: false,
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}>
                <MessStack.Screen
                    name={MESS_ROUTE.messScreen}
                    component={MessScreen}
                />

                <MessStack.Screen
                    name={MESS_ROUTE.chatDetail}
                    component={ChatDetail}
                    options={{
                        gestureEnabled: isIOS ? !isModeExp : false,
                    }}
                />

                <MessStack.Screen
                    name={MESS_ROUTE.chatDetailSetting}
                    component={ChatDetailSetting}
                />

                <MessStack.Screen
                    name={MESS_ROUTE.publicChatting}
                    component={PublicChatting}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                        animationEnabled: false,
                    }}
                />
            </MessStack.Navigator>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});

export default MessRoute;
