import DateTimePicker from '@react-native-community/datetimepicker';
import {Metrics} from 'asset/metrics';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

interface ElementProps {
    initDate: Date;
    onChange: any;
    onPressBackground(): void;
}

const DatetimePickerIOS = (props: ElementProps) => {
    const theme = Redux.getTheme();

    return (
        <View style={styles.datetimePickerIOS}>
            <View
                style={[
                    styles.datetimePickerIOS,
                    {backgroundColor: theme.backgroundColor, opacity: 0.4},
                ]}
                onTouchEnd={props.onPressBackground}
            />
            <View
                style={[
                    styles.pickerBox,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <DateTimePicker
                    value={props.initDate}
                    display="spinner"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    textColor={theme.textColor}
                    onChange={props.onChange}
                />
            </View>
        </View>
    );
};

const DatetimePickerAndroid = (props: ElementProps) => {
    return (
        <DateTimePicker
            value={props.initDate}
            display="spinner"
            style={{
                width: '100%',
                height: '100%',
            }}
            onChange={props.onChange}
        />
    );
};

/**
 * BOSS HERE
 */
interface DateTimePickerProps {
    initDate: Date;
    onChangeDateTime(selectedDate: Date): void;
    onPressBackground(): void;
}

const StyleDatetimePicker = (props: DateTimePickerProps) => {
    const {initDate, onChangeDateTime, onPressBackground} = props;

    const onChange = (event: any, date: Date) => {
        onChangeDateTime(date);
    };

    if (isIOS) {
        return (
            <DatetimePickerIOS
                initDate={initDate}
                onChange={onChange}
                onPressBackground={onPressBackground}
            />
        );
    }
    return (
        <DatetimePickerAndroid
            initDate={initDate}
            onChange={onChange}
            onPressBackground={() => null}
        />
    );
};

const styles = ScaledSheet.create({
    datetimePickerIOS: {
        position: 'absolute',
        width: Metrics.width,
        height: Metrics.height,
        justifyContent: 'center',
    },
    pickerBox: {
        width: '100%',
        height: '140@vs',
        borderRadius: '30@ms',
    },
});

export default StyleDatetimePicker;
