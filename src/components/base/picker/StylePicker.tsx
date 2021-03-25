import useRedux from 'hook/useRedux';
import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import StyleText from '../StyleText';

interface PickerProps {
    dataList: Array<any>;
    currentValue?: String;
    mission(item?: String): void;
    onTouchOut(): void;
}

const StylePicker = (props: PickerProps) => {
    const {dataList, mission, onTouchOut} = props;
    const theme = useRedux().getTheme();

    return (
        <View style={styles.container}>
            {/* FILL BACKGROUND FOR PICKER */}
            <View
                style={[
                    styles.backgroundOpacity,
                    {backgroundColor: theme.backgroundColor},
                ]}
                onTouchEnd={onTouchOut}
            />

            <View
                style={[styles.contentPart, {borderColor: theme.borderColor}]}>
                {/* LIST DATA ELEMENT */}
                <View style={styles.listData}>
                    <FlatList
                        data={dataList}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={styles.buttonList}
                                onPress={() => mission(item)}>
                                <StyleText
                                    originValue={item}
                                    customStyle={[
                                        styles.textList,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={() => (
                            <View
                                style={[
                                    styles.separator,
                                    {borderColor: theme.borderColor},
                                ]}
                            />
                        )}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // FOR PART FILL COLOR
    backgroundOpacity: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.8,
    },

    // FOR PART CONTENT
    contentPart: {
        width: '80%',
        borderWidth: 1.5,
        borderRadius: '20@vs',
    },
    // ||
    listData: {
        width: '100%',
        maxHeight: '180@vs',
        paddingBottom: '8@vs',
    },
    buttonList: {
        width: '100%',
        paddingVertical: '10@vs',
        alignItems: 'center',
    },
    textList: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    separator: {
        width: '80%',
        borderWidth: 0.5,
        alignSelf: 'center',
    },
});

export default StylePicker;
