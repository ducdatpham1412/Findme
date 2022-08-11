import Images from 'asset/img/images';
import {StyleButton, StyleImage, StyleText} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {forwardRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
    location: string;
    onChangeLocation(value: string): void;
}

const ModalCheckIn = (props: Props, ref: any) => {
    const {location, onChangeLocation} = props;
    const {t} = useTranslation();
    const theme = Redux.getTheme();
    const inputRef = useRef<TextInput>(null);

    const [tempLocation, setTempLocation] = useState(location);

    const onConfirm = (value: string) => {
        onChangeLocation(value);
        ref.current.close();
    };

    return (
        <Modalize ref={ref} modalStyle={styles.modal} withHandle={false}>
            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <ButtonX
                    containerStyle={styles.buttonClose}
                    onPress={() => {
                        ref.current.close();
                        setTempLocation(location);
                    }}
                />

                <StyleText
                    i18Text="profile.post.checkIn"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />

                <View
                    style={[
                        styles.inputView,
                        {
                            backgroundColor: theme.backgroundTextInput,
                        },
                    ]}>
                    <Ionicons
                        name="ios-location-sharp"
                        style={[styles.iconLocation, {color: theme.textColor}]}
                    />
                    <TextInput
                        ref={inputRef}
                        defaultValue={location}
                        onChangeText={value => setTempLocation(value)}
                        placeholder={t('profile.post.whereAreYouNow')}
                        placeholderTextColor={theme.borderColor}
                        style={[styles.input, {color: theme.textColor}]}
                        returnKeyType="done"
                        onSubmitEditing={() => onConfirm(tempLocation)}
                    />
                </View>

                <StyleButton
                    containerStyle={styles.buttonView}
                    titleStyle={styles.titleButton}
                    title="common.save"
                    onPress={() => onConfirm(tempLocation)}
                />

                <StyleText
                    i18Text="profile.post.willDebutSearchOnGoogleMap"
                    customStyle={[
                        styles.waitForUsText,
                        {color: theme.borderColor},
                    ]}
                />
                <StyleImage
                    source={Images.images.successful}
                    customStyle={styles.imgSquirrel}
                />
            </View>
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: '90%',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        alignSelf: 'center',
        borderRadius: '7@ms',
        alignItems: 'center',
        paddingHorizontal: '10@s',
    },
    buttonClose: {
        position: 'absolute',
        top: '7@s',
        right: '7@s',
    },
    title: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    inputView: {
        width: '100%',
        marginTop: '10@vs',
        borderRadius: '5@ms',
        paddingHorizontal: '8@s',
        paddingVertical: '8@vs',
        flexDirection: 'row',
    },
    iconLocation: {
        fontSize: '17@ms',
    },
    input: {
        marginVertical: 0,
        paddingVertical: 0,
        maxHeight: '70@vs',
        paddingLeft: '5@s',
        paddingRight: '15@s',
    },
    imgSquirrel: {
        width: '150@s',
        height: '150@s',
        marginTop: '20@vs',
    },
    buttonView: {
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        marginTop: '13@vs',
    },
    titleButton: {
        fontSize: '15@ms',
        fontWeight: 'normal',
    },
    waitForUsText: {
        fontSize: '12@ms',
        textAlign: 'center',
        marginTop: '40@vs',
    },
});

export default forwardRef(ModalCheckIn);
