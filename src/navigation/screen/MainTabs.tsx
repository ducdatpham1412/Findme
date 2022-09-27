import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import NotificationScreen from 'feature/notification/NotificationScreen';
import ReputationScreen from 'feature/reputation/ReputationScreen';
import Redux from 'hook/useRedux';
import TabNavigator from 'navigation/components/TabNavigator';
import {MAIN_SCREEN} from 'navigation/config/routes';
import React from 'react';
import {View} from 'react-native';
import DiscoveryRoute from './tabs/DiscoveryRoute';
import MessRoute from './tabs/MessRoute';
import ProfileRoute from './tabs/ProfileRoute';

const BottomTab = createBottomTabNavigator();

const MainTabs: React.FunctionComponent = () => {
    const theme = Redux.getTheme();

    return (
        <View
            style={{
                flex: 1,
                overflow: 'visible',
                backgroundColor: theme.backgroundColor,
            }}>
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
                    name={MAIN_SCREEN.reputation}
                    component={ReputationScreen}
                />

                <BottomTab.Screen
                    name={MAIN_SCREEN.notificationRoute}
                    component={NotificationScreen}
                />

                <BottomTab.Screen
                    name={MAIN_SCREEN.profileRoute}
                    component={ProfileRoute}
                />
            </BottomTab.Navigator>
        </View>
    );
};

export default MainTabs;
