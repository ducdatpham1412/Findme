import {TypePrice} from 'api/interface/discovery';
import {FONT_SIZE} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleText} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import I18Next from 'utility/I18Next';
import {validateIsNumber} from 'utility/validate';

interface Props {
    prices: Array<TypePrice>;
    onAddPrice(value: TypePrice): void;
    theme: TypeTheme;
}

interface States {
    numberPeople: string;
    priceValue: string;
}

let timeout: any;

const borderWidthError = Platform.select({
    ios: moderateScale(0.25),
    android: moderateScale(0.5),
});

class ModalAddPrice extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    inputNumberRef = React.createRef<TextInput>();

    inputPriceRef = React.createRef<TextInput>();

    state: States = {
        numberPeople: '',
        priceValue: '',
    };

    show() {
        this.modalRef.current?.open();
        timeout = setTimeout(() => {
            this.inputNumberRef.current?.focus();
        }, 200);
        return () => clearTimeout(timeout);
    }

    private onConfirm = () => {
        this.props.onAddPrice({
            number_people: Number(this.state.numberPeople),
            value: this.state.priceValue,
        });
        this.setState({
            numberPeople: '',
            priceValue: '',
        });
        this.modalRef.current?.close();
    };

    render() {
        const {theme, prices} = this.props;
        const {numberPeople, priceValue} = this.state;

        const lastPrice = prices[prices.length - 1];

        const isValidNumberPeople =
            lastPrice && numberPeople
                ? Number(numberPeople) > lastPrice.number_people
                : true;
        const borderWidthNumberPeople = isValidNumberPeople
            ? 0
            : borderWidthError;

        const isValidPriceValue =
            lastPrice && priceValue
                ? Number(priceValue) < Number(lastPrice.value)
                : true;
        const borderWidthPrice = isValidPriceValue ? 0 : borderWidthError;

        const Content = () => {
            return (
                <>
                    <View style={styles.inputView}>
                        <TextInput
                            ref={this.inputNumberRef}
                            defaultValue={numberPeople}
                            onChangeText={value =>
                                this.setState({
                                    numberPeople: value,
                                })
                            }
                            placeholder={I18Next.t('profile.number')}
                            placeholderTextColor={theme.borderColor}
                            style={[
                                styles.inputNumberPeople,
                                {
                                    color: theme.textColor,
                                    backgroundColor: theme.backgroundTextInput,
                                    borderWidth: borderWidthNumberPeople,
                                },
                            ]}
                            onSubmitEditing={() =>
                                this.inputPriceRef.current?.focus()
                            }
                            keyboardType="numeric"
                            returnKeyType="next"
                        />
                        <StyleText
                            originValue="-"
                            customStyle={[
                                styles.textMiddle,
                                {color: theme.borderColor},
                            ]}
                        />
                        <View
                            style={[
                                styles.inputPriceBox,
                                {
                                    backgroundColor: theme.backgroundTextInput,
                                    borderWidth: borderWidthPrice,
                                },
                            ]}>
                            <TextInput
                                ref={this.inputPriceRef}
                                value={priceValue}
                                onChangeText={value => {
                                    if (validateIsNumber(value)) {
                                        this.setState({
                                            priceValue: value,
                                        });
                                    }
                                }}
                                placeholder={I18Next.t('profile.price')}
                                placeholderTextColor={theme.borderColor}
                                style={[
                                    styles.inputPrice,
                                    {
                                        color: theme.textColor,
                                    },
                                ]}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                            <StyleText
                                originValue="vnd"
                                customStyle={[
                                    styles.textVnd,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </View>
                    </View>

                    {!isValidNumberPeople && (
                        <StyleText
                            i18Text="alert.numberPeopleMoreThan"
                            i18Params={{
                                value: lastPrice.number_people,
                            }}
                            customStyle={[
                                styles.textInvalidLink,
                                {color: theme.highlightColor},
                            ]}
                        />
                    )}

                    {!isValidPriceValue && (
                        <StyleText
                            i18Text="alert.priceLessThan"
                            i18Params={{
                                value: lastPrice.value,
                            }}
                            customStyle={[
                                styles.textInvalidLink,
                                {color: theme.highlightColor},
                            ]}
                        />
                    )}
                </>
            );
        };

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
                        }}
                    />
                    <StyleText
                        i18Text="profile.addPrice"
                        customStyle={[styles.title, {color: theme.textColor}]}
                    />
                    {Content()}
                    <StyleButton
                        containerStyle={styles.buttonView}
                        titleStyle={styles.titleButton}
                        title="common.save"
                        disable={
                            !isValidNumberPeople ||
                            !isValidPriceValue ||
                            !numberPeople ||
                            !priceValue
                        }
                        onPress={() => this.onConfirm()}
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
    textMiddle: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '10@s',
    },
    inputView: {
        width: '100%',
        marginTop: '15@vs',
        paddingHorizontal: '8@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputNumberPeople: {
        flex: 1,
        marginVertical: 0,
        paddingTop: '8@vs',
        paddingBottom: '8@vs',
        paddingHorizontal: '7@s',
        borderRadius: '5@ms',
        fontSize: FONT_SIZE.normal,
        borderColor: Theme.common.red,
    },
    inputPriceBox: {
        flex: 3,
        marginVertical: 0,
        borderRadius: '5@ms',
        borderColor: Theme.common.red,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputPrice: {
        flex: 1,
        marginVertical: 0,
        paddingTop: '8@vs',
        paddingBottom: '8@vs',
        paddingHorizontal: '7@s',
        fontSize: FONT_SIZE.normal,
    },
    textVnd: {
        marginRight: '7@s',
        fontSize: FONT_SIZE.normal,
    },
    textInvalidLink: {
        fontSize: '10@ms',
        alignSelf: 'flex-start',
        marginTop: '7@vs',
        marginLeft: '10@s',
    },
    buttonView: {
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        marginTop: '20@vs',
    },
    titleButton: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
});

export default ModalAddPrice;
