import DateTimePicker from '@react-native-community/datetimepicker';
import useRedux from 'hook/useRedux';
import React from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const DatetimePickerIOS = (props: any) => {
    const theme = useRedux().getTheme();

    return (
        <View
            style={[
                styles.datetimePickerIOS,
                {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor,
                },
            ]}>
            <DateTimePicker
                value={props.initDate}
                display="spinner"
                style={{
                    width: '100%',
                    height: '100%',
                }}
                textColor={theme.textColor}
                onChange={props.mission}
            />
        </View>
    );
};

const DatetimePickerAndroid = (props?: any) => {
    return (
        <DateTimePicker
            value={props.initDate}
            display="spinner"
            style={{
                width: '100%',
                height: '100%',
            }}
            onChange={props.mission}
        />
    );
};

/**
 * BOSS HERE
 */
interface DateTimePickerProps {
    initDate: Date;
    mission(event: any, selectedDate: Date): void;
}

const StyleDatetimePicker = (props: DateTimePickerProps) => {
    const {initDate, mission} = props;

    if (Platform.OS === 'ios') {
        return <DatetimePickerIOS initDate={initDate} mission={mission} />;
    }
    return <DatetimePickerAndroid initDate={initDate} mission={mission} />;
};

const styles = ScaledSheet.create({
    datetimePickerIOS: {
        width: '90%',
        height: '120@vs',
        borderWidth: 0.5,
        borderRadius: '20@vs',
        overflow: 'hidden',
        marginTop: '14@vs',
        alignSelf: 'center',
    },
});

export default StyleDatetimePicker;
