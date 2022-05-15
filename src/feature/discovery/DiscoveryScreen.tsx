import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import TabBarCoupleGroup from './components/TabBarCoupleGroup';
import ListBubbleCouple from './ListBubbleCouple';
import ListBubbleGroup from './ListBubbleGroup';

const TopTab = createMaterialTopTabNavigator();

const DiscoveryScreen = () => {
    return (
        <View style={styles.container}>
            <TopTab.Navigator
                tabBar={(props: MaterialTopTabBarProps) => (
                    <TabBarCoupleGroup materialProps={props} />
                )}>
                <TopTab.Screen
                    name={DISCOVERY_ROUTE.listBubbleCouple}
                    component={ListBubbleCouple}
                />
                <TopTab.Screen
                    name={DISCOVERY_ROUTE.listBubbleGroup}
                    component={ListBubbleGroup}
                />
            </TopTab.Navigator>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});

export default DiscoveryScreen;
