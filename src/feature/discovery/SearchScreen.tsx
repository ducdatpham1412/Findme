import {Metrics} from 'asset/metrics';
import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const SearchScreen = () => {
    return (
        <View style={styles.container}>
            <Text>SearchScreen</Text>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
});

export default SearchScreen;
