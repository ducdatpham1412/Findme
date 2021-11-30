import Images from 'asset/img/images';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
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
    const {index, indexAcc, onSelectAcc, onDeleteAcc} = props;
    const theme = Redux.getTheme();

    return (
        <StyleTouchable
            customStyle={[
                styles.moduleAcc,
                {borderBottomColor: theme.borderColor},
            ]}
            onPress={() => onSelectAcc(index)}>
            {/* Logo */}
            <View style={[styles.iconBox, {borderColor: theme.highlightColor}]}>
                <StyleIcon source={Images.images.logo} size={14} />
            </View>

            {/* username */}
            <View style={styles.usernameBox}>
                <StyleText
                    originValue={indexAcc.username}
                    customStyle={[
                        styles.textUsername,
                        {color: theme.textColor},
                    ]}
                />
            </View>

            {/* delete from local storage */}
            <StyleTouchable
                style={styles.deleteAccBox}
                onPress={() => onDeleteAcc(index)}>
                <Feather
                    name="x"
                    style={[styles.iconCancel, {color: theme.borderColor}]}
                />
            </StyleTouchable>
        </StyleTouchable>
    );
};

/**
 *  BOSS HERE
 */

const ListSaveAcc = (props: ListSaveAccProps) => {
    const {listAcc, selectAcc, deleteAcc} = props;
    const {backgroundColor} = Redux.getTheme();

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
            <View style={[styles.background, {backgroundColor}]} />

            {listAcc.map((item, index) => (
                <ModuleTagAcc
                    key={index}
                    index={index}
                    indexAcc={item}
                    onSelectAcc={selectAcc}
                    onDeleteAcc={deleteAcc}
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
        opacity: 0.9,
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
    textUsername: {
        fontSize: '13@ms',
    },
});

export default ListSaveAcc;
