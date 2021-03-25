import Images from 'asset/img/images';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface ListSaveAccProps {
    listAcc: Array<any>;
    selectAcc(index: any): any;
    deleteAcc(index: any): any;
}

const ModuleTagAcc = (props: any) => {
    const {index, indexAcc, onSelect, onDelete} = props;
    const theme = useRedux().getTheme();

    return (
        <View
            style={[styles.moduleAcc, {borderBottomColor: theme.borderColor}]}>
            {/* ICON LOGO */}
            <View style={[styles.iconBox, {borderColor: theme.highlightColor}]}>
                <StyleIcon source={Images.logo} size={14} />
            </View>

            {/* USERNAME */}
            <StyleTouchable
                customStyle={styles.usernameBox}
                onPress={() => onSelect(index)}>
                <StyleText
                    originValue={indexAcc.username}
                    customStyle={{color: theme.textColor}}
                />
            </StyleTouchable>

            {/* ICON DELETE ACC */}
            <StyleTouchable
                style={styles.deleteAccBox}
                onPress={() => onDelete(index)}>
                <Feather
                    name="x"
                    style={[styles.iconCancel, {color: theme.borderColor}]}
                />
            </StyleTouchable>
        </View>
    );
};

/**
 *  BOSS HERE
 */

const ListSaveAcc = (props: ListSaveAccProps) => {
    const {listAcc, selectAcc, deleteAcc} = props;
    const {backgroundColor} = useRedux().getTheme();

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
            <View style={[styles.background, {backgroundColor}]} />

            {listAcc.map((item, index) => (
                <ModuleTagAcc
                    key={index}
                    index={index}
                    indexAcc={item}
                    onSelect={selectAcc}
                    onDelete={deleteAcc}
                />
            ))}
        </ScrollView>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        maxHeight: '200@vs',
        position: 'absolute',
        paddingBottom: '20@vs',
        top: '45@vs',
        zIndex: 9,
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        opacity: 0.8,
    },
    moduleAcc: {
        width: '100%',
        height: '40@vs',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '8@vs',
        paddingHorizontal: '20@vs',
        borderBottomWidth: 0.3,
    },
    iconBox: {
        width: '30@vs',
        height: '30@vs',
        borderRadius: '20@vs',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    usernameBox: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '10@vs',
    },
    deleteAccBox: {
        width: '35@vs',
        height: '35@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCancel: {
        fontSize: '17@ms',
    },
});

export default ListSaveAcc;
