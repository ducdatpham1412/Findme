import DateTimePicker from '@react-native-community/datetimepicker';
import FindmeStore from 'app-redux/store';
import {THEME_TYPE} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import React, {Component} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

interface Props {
    initDate: Date;
    onChangeDateTime(selectedDate: Date): void;
    minimumDate?: Date;
}

interface States {
    display: boolean;
}

class ClassDateTimePicker extends Component<Props, States> {
    state: States = {
        display: false,
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

    private onChange(_: any, date: Date) {
        this.props.onChangeDateTime(date);
    }

    render() {
        const {initDate, minimumDate} = this.props;
        const theme =
            FindmeStore.getState().accountSlice.passport.setting.theme ===
            THEME_TYPE.darkTheme
                ? Theme.darkTheme
                : Theme.lightTheme;

        if (!this.state.display) {
            return null;
        }

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
                        onTouchEnd={() => this.hide()}
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
                            value={initDate}
                            display="spinner"
                            style={styles.pickView}
                            textColor={theme.textHightLight}
                            onChange={(_: any, date: any) =>
                                this.onChange(_, date)
                            }
                            minimumDate={minimumDate}
                        />
                        {/* <View style={styles.buttonView} /> */}
                    </View>
                </View>
            );
        }
        return (
            <DateTimePicker
                value={initDate}
                display="spinner"
                style={styles.pickView}
                onChange={(_: any, date: any) => this.onChange(_, date)}
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
        height: '30@vs',
        alignSelf: 'center',
        borderRadius: '10@ms',
        flexDirection: 'row',
    },
});

export default ClassDateTimePicker;
