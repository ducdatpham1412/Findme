import React from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {selectBgCardStyle} from 'utility/assistant';

const SearchView = () => {
    return (
        <View style={styles.container}>
            <ScrollView />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: selectBgCardStyle(0.7),
    },
});

export default SearchView;
