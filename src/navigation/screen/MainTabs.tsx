import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import ModalCommentDiscovery from 'feature/discovery/components/ModalCommentDiscovery';
import NotificationScreen from 'feature/notification/NotificationScreen';
import TabNavigator from 'navigation/components/TabNavigator';
import {MAIN_SCREEN} from 'navigation/config/routes';
import React from 'react';
import DiscoveryRoute from './tabs/DiscoveryRoute';
import MessRoute from './tabs/MessRoute';
import ProfileRoute from './tabs/ProfileRoute';

const BottomTab = createBottomTabNavigator();

const NullTab = () => {
    return null;
};

const MainTabs: React.FunctionComponent = () => {
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

                <BottomTab.Screen name={'null'} component={NullTab} />

                <BottomTab.Screen
                    name={MAIN_SCREEN.notificationRoute}
                    component={NotificationScreen}
                />

                <BottomTab.Screen
                    name={MAIN_SCREEN.profileRoute}
                    component={ProfileRoute}
                    // options={{
                    //     lazy: false,
                    // }}
                />
            </BottomTab.Navigator>

            <ModalCommentDiscovery />
        </>
    );
};

export default MainTabs;
