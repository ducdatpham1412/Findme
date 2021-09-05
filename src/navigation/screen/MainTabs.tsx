import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabNavigator from 'navigation/components/TabNavigator';
import {MAIN_SCREEN} from 'navigation/config/routes';
import React from 'react';
import DiscoveryRoute from './tabs/DiscoveryRoute';
import ProfileRoute from './tabs/ProfileRoute';

const BottomTab = createBottomTabNavigator();

const MainTabs: React.FunctionComponent = () => {
    return (
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
    );
};

export default MainTabs;
