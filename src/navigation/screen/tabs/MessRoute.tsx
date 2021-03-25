import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import ChatDetail from 'feature/mess/ChatDetail';
import MessScreen from 'feature/mess/MessScreen';
import useRedux from 'hook/useRedux';
import {MESS_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {selectBgCardStyle} from 'utility/assistant';

const MessStack = createStackNavigator();

const MessRoute = (props: any) => {
    const theme = useRedux().getTheme();
    const backgroundColor = selectBgCardStyle(theme);

    return (
        <Animated.View
            style={[
                styles.container,
                {transform: [{translateX: props.translateX}]},
            ]}>
            <MessStack.Navigator
                screenOptions={{
                    cardStyle: [
                        styles.cardStyle,
                        {borderColor: theme.borderColor, backgroundColor},
                    ],
                    headerShown: false,
                    cardStyleInterpolator:
                        CardStyleInterpolators.forFadeFromBottomAndroid,
                }}>
                <MessStack.Screen
                    name={MESS_ROUTE.messScreen}
                    component={MessScreen}
                />

                <MessStack.Screen
                    name={MESS_ROUTE.chatDetail}
                    component={ChatDetail}
                />
            </MessStack.Navigator>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        top: '55@vs',
        paddingBottom: '55@vs',
    },
    cardStyle: {
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderTopLeftRadius: '20@vs',
        borderTopRightRadius: '20@vs',
    },
});

export default MessRoute;
