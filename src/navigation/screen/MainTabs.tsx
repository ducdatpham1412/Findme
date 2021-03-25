import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MAIN_SCREEN} from 'navigation/config/routes';

import DiscoveryRoute from './tabs/DiscoveryRoute';
import ProfileRoute from './tabs/ProfileRoute';
import TabNavigator from 'navigation/components/TabNavigator';
import TabBarProvider from 'navigation/config/TabBarProvider';

const BottomTab = createBottomTabNavigator();

const MainTabs: React.FunctionComponent = () => {
    return (
        <TabBarProvider>
            <BottomTab.Navigator tabBar={props => <TabNavigator {...props} />}>
                {/* DISCOVERY_SCREEN WILL CONTAIN MESS AS A CHILD ELEMENT */}
                <BottomTab.Screen
                    name={MAIN_SCREEN.discoveryRoute}
                    component={DiscoveryRoute}
                />

                {/* PROFILE SCREEN WILL SWITCH TO SETTING SCREEN */}
                <BottomTab.Screen
                    name={MAIN_SCREEN.profileRoute}
                    component={ProfileRoute}
                />

                {/* SETTING SCREEN WILL DECLARE IN PROFILE_SCREEN TO APPLY TRANSITION EFFECT */}
            </BottomTab.Navigator>
        </TabBarProvider>
    );
};

export default MainTabs;
