import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import SwipeImages from 'components/SwipeImages';
import DetailBubble from 'feature/discovery/DetailBubble';
import InteractBubble from 'feature/discovery/InteractBubble';
import ReportUser from 'feature/discovery/ReportUser';
import ChatDetail from 'feature/mess/ChatDetail';
import ChatDetailGroup from 'feature/mess/ChatDetailGroup';
import ChatDetailSetting from 'feature/mess/ChatDetailSetting';
import PublicChatting from 'feature/mess/PublicChatting';
import CreateGroup from 'feature/profile/CreateGroup';
import CreatePostPreview from 'feature/profile/CreatePostPreview';
import ListFollows from 'feature/profile/ListFollows';
import OtherProfile from 'feature/profile/OtherProfile';
import ListDetailPost from 'feature/profile/post/ListDetailPost';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {MESS_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS, selectBgCardStyle} from 'utility/assistant';
import MainTabs from './MainTabs';
import SettingRoute from './tabs/SettingRoute';

const Stack = createStackNavigator();

const AppStack = () => {
    const theme = Redux.getTheme();

    const cardStyle = {
        backgroundColor: theme.backgroundColor,
    };

    return (
        <SafeAreaView
            style={[styles.container, {backgroundColor: theme.backgroundColor}]}
            edges={['left', 'top', 'right', 'bottom']}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name={ROOT_SCREEN.mainScreen}
                    component={MainTabs}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forHorizontalIOS,
                    }}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.otherProfile}
                    component={OtherProfile}
                    options={{
                        cardStyle,
                    }}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.listFollows}
                    component={ListFollows}
                    options={{
                        cardStyle,
                    }}
                />

                <Stack.Screen
                    name={ROOT_SCREEN.detailBubble}
                    component={DetailBubble}
                    options={{
                        cardStyle,
                    }}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.listDetailPost}
                    component={ListDetailPost}
                    options={{
                        // cardStyleInterpolator:
                        //     CardStyleInterpolators.forScaleFromCenterAndroid,
                        cardStyle,
                    }}
                />

                {/* Interact Bubble */}
                <Stack.Screen
                    options={{
                        cardStyle: [{backgroundColor: selectBgCardStyle(0.3)}],
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                    }}
                    name={ROOT_SCREEN.interactBubble}
                    component={InteractBubble}
                />

                {/* Swipe Image */}
                <Stack.Screen
                    options={{
                        cardStyle,
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                    }}
                    name={ROOT_SCREEN.swipeImages}
                    component={SwipeImages}
                />

                <Stack.Screen
                    name={ROOT_SCREEN.reportUser}
                    component={ReportUser}
                    options={{
                        cardStyle,
                    }}
                />

                <Stack.Screen
                    name={PROFILE_ROUTE.settingRoute}
                    component={SettingRoute}
                />

                <Stack.Screen
                    name={PROFILE_ROUTE.createPostPreview}
                    component={CreatePostPreview}
                />
                <Stack.Screen
                    name={PROFILE_ROUTE.createGroup}
                    component={CreateGroup}
                />
                <Stack.Screen
                    name={MESS_ROUTE.chatDetail}
                    component={ChatDetail}
                    options={{
                        gestureEnabled: isIOS,
                    }}
                />
                <Stack.Screen
                    name={MESS_ROUTE.chatDetailGroup}
                    component={ChatDetailGroup}
                    options={{
                        gestureEnabled: isIOS,
                    }}
                />
                <Stack.Screen
                    name={MESS_ROUTE.chatDetailSetting}
                    component={ChatDetailSetting}
                />

                <Stack.Screen
                    name={MESS_ROUTE.publicChatting}
                    component={PublicChatting}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                        animationEnabled: false,
                    }}
                />
            </Stack.Navigator>
        </SafeAreaView>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
    },
});

export default AppStack;
