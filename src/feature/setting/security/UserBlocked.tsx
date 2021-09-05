import {apiGetListBlocked, apiUnBlockUser} from 'api/module';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface ModuleBlock {
    image: string;
    name: string;
    onUnBlock(): void;
}

const ModuleUserBlock = (props: ModuleBlock) => {
    const theme = Redux.getTheme();
    const {image, name, onUnBlock} = props;

    return (
        <View
            style={[
                styles.moduleUserBlock,
                {backgroundColor: theme.holderColor},
            ]}>
            <View style={styles.avatarBox}>
                <StyleImage
                    customStyle={[
                        styles.avatar,
                        {borderColor: theme.borderColor},
                    ]}
                    source={{uri: image}}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.nameBox}>
                <StyleText
                    originValue={name}
                    customStyle={[styles.nameText, {color: theme.textColor}]}
                />
            </View>

            <View style={styles.buttonCancelBox}>
                <StyleTouchable onPress={onUnBlock}>
                    <Feather
                        name="x"
                        style={[styles.iconCancel, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
            </View>
        </View>
    );
};

/**
 * BOSS HERE
 */
const UserBlocked = () => {
    const [listBlocked, setListBlocked] = useState<
        Array<{
            id: number;
            profile: {
                id: number;
                avatar: string;
                name: string;
            };
        }>
    >();

    const getData = async () => {
        try {
            const res = await apiGetListBlocked();
            setListBlocked(res.data);
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onUnBlock = async (id: number) => {
        try {
            await apiUnBlockUser(id);
            const temp: Array<any> = [];
            listBlocked?.forEach(item => {
                if (item.profile.id !== id) {
                    temp.push(item);
                }
            });
            setListBlocked(temp);
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <View style={styles.container}>
            {!!listBlocked &&
                listBlocked.map(item => (
                    <ModuleUserBlock
                        key={item.id}
                        image={item.profile.avatar}
                        name={item.profile.name}
                        onUnBlock={() => onUnBlock(item.profile.id)}
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
        height: '45@vs',
        marginVertical: '3@vs',
        borderRadius: '20@vs',
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
