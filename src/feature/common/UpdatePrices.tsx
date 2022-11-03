import {Metrics} from 'asset/metrics';
import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const UpdatePrices = () => {
    return (
        <View style={styles.container}>
            <Text>UpdatePrices</Text>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeBottomPadding,
    },
});

export default UpdatePrices;
