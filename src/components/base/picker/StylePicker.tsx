import {Metrics} from 'asset/metrics';
import Redux from 'hook/useRedux';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import StyleIcon from '../StyleIcon';
import StyleText from '../StyleText';

interface PickerProps {
    dataList: Array<{
        id: any;
        icon?: string;
        name: string;
        [key: string]: any;
    }>;
    currentValue?: string;
    mission(item?: any, index?: number): void;
    onTouchOut(): void;
}

const StylePicker = (props: PickerProps) => {
    const {dataList, mission, onTouchOut} = props;
    const theme = Redux.getTheme();
    const {t} = useTranslation();

    const haveIcon = !!dataList[0]?.icon;

    return (
        <View style={styles.container}>
            {/* FILL BACKGROUND FOR PICKER */}
            <View
                style={[
                    styles.spaceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
                onTouchEnd={onTouchOut}
            />

            <View
                style={[styles.contentView, {borderColor: theme.borderColor}]}>
                <FlatList
                    data={dataList}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={[
                                styles.elementBox,
                                {
                                    justifyContent: haveIcon
                                        ? 'flex-start'
                                        : 'center',
                                    borderColor: theme.borderColor,
                                },
                            ]}
                            onPress={() => mission(item)}>
                            {haveIcon && (
                                <StyleIcon
                                    source={{uri: item.icon}}
                                    size={20}
                                />
                            )}
                            {haveIcon && (
                                <View
                                    style={[
                                        styles.cord,
                                        {borderColor: theme.borderColor},
                                    ]}
                                />
                            )}
                            <StyleText
                                i18Text={t(item.name)}
                                customStyle={[
                                    styles.textList,
                                    {color: theme.textColor},
                                ]}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    // ItemSeparatorComponent={() => (
                    //     <View
                    //         style={[
                    //             styles.separator,
                    //             {
                    //                 borderColor: theme.borderColor,
                    //                 borderWidth: haveIcon ? 0 : 0.5,
                    //             },
                    //         ]}
                    //     />
                    // )}
                    style={styles.listStyle}
                    contentContainerStyle={styles.contentList}
                />
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: Metrics.width,
        height: '100%',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // space background
    spaceBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.8,
    },

    // content
    contentView: {
        width: '80%',
        borderWidth: 0,
        borderRadius: '20@vs',
    },
    listStyle: {
        width: '100%',
        maxHeight: Metrics.height / 2.5,
    },
    contentList: {
        paddingHorizontal: '20@s',
        paddingVertical: '20@vs',
    },
    separator: {
        width: '80%',
        alignSelf: 'center',
    },
    // element in list
    elementBox: {
        width: '100%',
        paddingVertical: '10@vs',
        paddingHorizontal: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '7@vs',
        borderRadius: '50@s',
        borderWidth: 0.5,
    },
    textList: {
        fontSize: '17@ms',
    },
    cord: {
        width: '10@s',
        borderWidth: 0.5,
        marginHorizontal: '5@s',
    },
});

export default StylePicker;
