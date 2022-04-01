import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import ModalComment from 'feature/discovery/components/ModalComment';
import NotificationScreen from 'feature/notification/NotificationScreen';
import Redux from 'hook/useRedux';
import TabNavigator from 'navigation/components/TabNavigator';
import {MAIN_SCREEN} from 'navigation/config/routes';
import React from 'react';
import DiscoveryRoute from './tabs/DiscoveryRoute';
import MessRoute from './tabs/MessRoute';
import ProfileRoute from './tabs/ProfileRoute';

const BottomTab = createBottomTabNavigator();

const MainTabs: React.FunctionComponent = () => {
    const bubbleFocusing = Redux.getBubbleFocusing();
    const displayComment = Redux.getDisplayComment();

    return (
        <>
            <BottomTab.Navigator
                tabBar={(props: BottomTabBarProps) => (
                    <TabNavigator {...props} />
                )}
                screenOptions={{
                    headerShown: false,
                }}>
                <BottomTab.Screen
                    name={MAIN_SCREEN.discoveryRoute}
                    component={DiscoveryRoute}
                    options={{
                        lazy: false,
                    }}
                />

                <BottomTab.Screen
                    name={MAIN_SCREEN.messRoute}
                    component={MessRoute}
                    options={{
                        lazy: false,
                    }}
                />

                <BottomTab.Screen
                    name={MAIN_SCREEN.profileRoute}
                    component={ProfileRoute}
                    options={{
                        lazy: false,
                    }}
                />

                <BottomTab.Screen
                    name={MAIN_SCREEN.notificationRoute}
                    component={NotificationScreen}
                />
            </BottomTab.Navigator>

            <ModalComment
                bubbleFocusing={bubbleFocusing}
                displayComment={displayComment}
            />
        </>
    );
};

export default MainTabs;
