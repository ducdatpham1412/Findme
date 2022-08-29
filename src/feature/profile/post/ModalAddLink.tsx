import {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleText} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import I18Next from 'utility/I18Next';
import {validateIsLink} from 'utility/validate';

interface Props {
    link: string;
    onChangeLink(value: string): void;
    theme: TypeTheme;
}

interface States {
    tempLink: string;
}

let timeout: any;

const borderWidthError = Platform.select({
    ios: moderateScale(0.5),
    android: moderateScale(1),
});

class ModalAddLink extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    inputRef = React.createRef<TextInput>();

    state: States = {
        tempLink: this.props.link,
    };

    show() {
        this.modalRef.current?.open();
        timeout = setTimeout(() => {
            this.inputRef.current?.focus();
        }, 200);
        return () => clearTimeout(timeout);
    }

    private onConfirm = (value: string) => {
        this.props.onChangeLink(value);
        this.modalRef.current?.close();
    };

    render() {
        const {theme, link} = this.props;
        const {tempLink} = this.state;
        const isValid = tempLink ? validateIsLink(tempLink) : true;
        const borderWidth = isValid ? 0 : borderWidthError;

        return (
            <Modalize
                ref={this.modalRef}
                modalStyle={styles.modal}
                withHandle={false}>
                <View
                    style={[
                        styles.container,
                        {backgroundColor: theme.backgroundColor},
                    ]}>
                    <ButtonX
                        containerStyle={styles.buttonClose}
                        onPress={() => {
                            this.modalRef.current?.close();
                            this.setState({
                                tempLink: link,
                            });
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
                            ref={this.inputRef}
                            defaultValue={tempLink}
                            onChangeText={value =>
                                this.setState({
                                    tempLink: value,
                                })
                            }
                            placeholder={I18Next.t('profile.post.pasteLink')}
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
                        onPress={() => this.onConfirm(tempLink)}
                    />
                </View>
            </Modalize>
        );
    }
}

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

export default ModalAddLink;
