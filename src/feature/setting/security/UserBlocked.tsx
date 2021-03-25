import {listUserBlock} from 'asset/staticData';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface ModuleBlock {
    image: string;
    name: string;
}

const ModuleUserBlock = (props: ModuleBlock) => {
    const theme = useRedux().getTheme();
    const {image, name} = props;

    return (
        <View
            style={[
                styles.moduleUserBlock,
                {backgroundColor: theme.holderColor},
            ]}>
            <View style={[styles.avatarBox, {borderColor: theme.borderColor}]}>
                <StyleImage customStyle={styles.avatar} source={{uri: image}} />
            </View>

            <View style={styles.nameBox}>
                <StyleText
                    originValue={name}
                    customStyle={[styles.nameText, {color: theme.textColor}]}
                />
            </View>

            <View style={styles.buttonCancelBox}>
                <StyleTouchable>
                    <Feather
                        name="x"
                        style={[styles.iconCancel, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
            </View>
        </View>
    );
};

const UserBlocked = () => {
    const [listData, setListData] = useState<any>([]);

    const getListBlocked = async () => {
        const res = await listUserBlock;
        setListData(res);
    };

    useEffect(() => {
        getListBlocked();
    }, []);

    return (
        <View style={styles.container}>
            {listData.map((item: any) => (
                <ModuleUserBlock
                    key={item?.id}
                    image={item?.image}
                    name={item?.name}
                />
            ))}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '90%',
        paddingHorizontal: '15@vs',
        paddingBottom: '100@vs',
        borderRadius: '10@vs',
    },
    moduleUserBlock: {
        width: '100%',
        height: '50@vs',
        marginVertical: '7@vs',
        borderRadius: '20@vs',
        paddingVertical: '5@vs',
        paddingHorizontal: '15@vs',
        flexDirection: 'row',
    },
    avatarBox: {
        flex: 1.5,
        justifyContent: 'center',
    },
    avatar: {
        width: '30@vs',
        height: '30@vs',
        borderWidth: 1,
        borderRadius: '15@vs',
    },
    nameBox: {
        flex: 4,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 20,
    },
    buttonCancelBox: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconCancel: {
        fontSize: 20,
    },
});

export default UserBlocked;
