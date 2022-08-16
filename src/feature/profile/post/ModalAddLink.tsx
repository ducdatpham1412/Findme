import {StyleButton, StyleText} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {forwardRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {validateIsLink} from 'utility/validate';

interface Props {
    link: string;
    onChangeLink(value: string): void;
}

const borderWidthError = Platform.select({
    ios: moderateScale(0.5),
    android: moderateScale(1),
});

const ModalAddLink = (props: Props, ref: any) => {
    const {link, onChangeLink} = props;
    const {t} = useTranslation();
    const theme = Redux.getTheme();

    const [tempLink, setTempLink] = useState(link);

    const isValid = tempLink ? validateIsLink(tempLink) : true;
    const borderWidth = isValid ? 0 : borderWidthError;

    const onConfirm = (value: string) => {
        onChangeLink(value);
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
                        setTempLink(link);
                    }}
                />

                <StyleText
                    i18Text="profile.post.addLink"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />

                <View
                    style={[
                        styles.inputView,
                        {
                            backgroundColor: theme.backgroundTextInput,
                            borderWidth,
                            borderColor: theme.highlightColor,
                        },
                    ]}>
                    <TextInput
                        defaultValue={tempLink}
                        onChangeText={value => setTempLink(value)}
                        placeholder={t('profile.post.pasteLink')}
                        placeholderTextColor={theme.borderColor}
                        multiline
                        style={[styles.input, {color: theme.textColor}]}
                    />
                </View>

                {!isValid && (
                    <StyleText
                        i18Text="alert.invalidLink"
                        customStyle={[
                            styles.textInvalidLink,
                            {color: theme.highlightColor},
                        ]}
                    />
                )}

                <StyleButton
                    containerStyle={styles.buttonView}
                    titleStyle={styles.titleButton}
                    title="common.save"
                    disable={!isValid}
                    onPress={() => onConfirm(tempLink)}
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
        marginTop: '100@vs',
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
    },
    input: {
        marginVertical: 0,
        paddingVertical: 0,
        maxHeight: '70@vs',
    },
    textInvalidLink: {
        fontSize: '10@ms',
        alignSelf: 'flex-start',
        marginTop: '7@vs',
        marginLeft: '2@s',
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
});

export default forwardRef(ModalAddLink);
