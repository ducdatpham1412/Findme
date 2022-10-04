import DateTimePicker from '@react-native-community/datetimepicker';
import FindmeStore from 'app-redux/store';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import React, {Component} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {chooseLanguageFromId, isIOS} from 'utility/assistant';
import StyleText from '../StyleText';
import StyleTouchable from '../StyleTouchable';

interface Props {
    initDate: Date;
    onChangeDateTime(selectedDate: Date): void;
    minimumDate?: Date;
    theme: TypeTheme;
}

interface States {
    display: boolean;
    tempDate: Date;
}

class ClassDateTimePicker extends Component<Props, States> {
    state: States = {
        display: false,
        tempDate: this.props.initDate,
    };

    show() {
        this.setState({
            display: true,
        });
    }

    hide() {
        this.setState({
            display: false,
        });
    }

    private onConfirm() {
        this.props.onChangeDateTime(this.state.tempDate);
        this.hide();
    }

    private onCancel() {
        this.setState({
            tempDate: this.props.initDate,
        });
        this.hide();
    }

    render() {
        const {initDate, minimumDate, theme} = this.props;
        const dateTheme =
            theme.backgroundColor === Theme.darkTheme.backgroundColor
                ? 'dark'
                : 'light';

        if (!this.state.display) {
            return null;
        }
        const {language} = FindmeStore.getState().accountSlice.passport.setting;

        if (isIOS) {
            return (
                <View style={styles.datetimePickerIOS}>
                    <View
                        style={[
                            styles.datetimePickerIOS,
                            {
                                backgroundColor: theme.backgroundOpacity(0.7),
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.pickerBox,
                            {
                                backgroundColor: theme.backgroundColor,
                                borderColor: theme.borderColor,
                            },
                        ]}>
                        <DateTimePicker
                            value={this.state.tempDate}
                            display="spinner"
                            style={styles.pickView}
                            textColor={theme.textHightLight}
                            onChange={(_: any, date: any) =>
                                this.setState({
                                    tempDate: date,
                                })
                            }
                            minimumDate={minimumDate}
                            themeVariant={dateTheme}
                            locale={chooseLanguageFromId(language)}
                        />
                        <View
                            style={[
                                styles.buttonView,
                                {
                                    backgroundColor: theme.backgroundColor,
                                    borderColor: theme.borderColor,
                                },
                            ]}>
                            <StyleTouchable
                                customStyle={[
                                    styles.buttonBox,
                                    {
                                        borderRightWidth: 0.5,
                                        borderRightColor: theme.holderColor,
                                    },
                                ]}
                                onPress={() => this.onCancel()}>
                                <StyleText
                                    i18Text="common.cancel"
                                    customStyle={[
                                        styles.textButton,
                                        {color: theme.highlightColor},
                                    ]}
                                />
                            </StyleTouchable>
                            <StyleTouchable
                                customStyle={styles.buttonBox}
                                onPress={() => this.onConfirm()}>
                                <StyleText
                                    i18Text="common.save"
                                    customStyle={[
                                        styles.textButton,
                                        {
                                            color: theme.highlightColor,
                                            fontWeight: 'bold',
                                        },
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <DateTimePicker
                value={initDate}
                display="spinner"
                style={styles.pickView}
                onChange={(_: any, date: any) =>
                    this.setState({
                        tempDate: date,
                    })
                }
                minimumDate={minimumDate}
            />
        );
    }
}

const styles = ScaledSheet.create({
    datetimePickerIOS: {
        position: 'absolute',
        width: Metrics.width,
        height: Metrics.height,
        justifyContent: 'center',
        top: 0,
    },
    pickerBox: {
        width: '90%',
        height: '200@vs',
        borderRadius: '10@ms',
        borderWidth: '1@ms',
        alignSelf: 'center',
    },
    pickView: {
        width: '100%',
        height: '200@vs',
    },
    buttonView: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: '10@ms',
        flexDirection: 'row',
        paddingVertical: '10@vs',
        borderWidth: '1@ms',
    },
    buttonBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        fontSize: FONT_SIZE.big,
    },
});

export default ClassDateTimePicker;
