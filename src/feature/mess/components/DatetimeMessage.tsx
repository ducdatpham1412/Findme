import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {formatDateMessage} from 'utility/format';

interface Props {
    datetime: string;
    senderName: string;
    isMyMessage: boolean;
    mostHeightDateTime: boolean;
}

const DatetimeMessage = ({
    datetime,
    senderName,
    isMyMessage,
    mostHeightDateTime,
}: Props) => {
    const theme = Redux.getTheme();

    const aim = useRef(new Animated.Value(0)).current;
    const [height, setHeight] = useState(0);
    aim.addListener(({value}) => setHeight(value));

    const onStartMoving = () => {
        Animated.spring(aim, {
            toValue: verticalScale(mostHeightDateTime ? verticalScale(30) : 0),
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        onStartMoving();
    }, [mostHeightDateTime]);

    return (
        <Animated.View
            style={[
                styles.container,
                {flexDirection: isMyMessage ? 'row-reverse' : 'row', height},
            ]}>
            {mostHeightDateTime && (
                <StyleText
                    originValue={`${senderName}, ${formatDateMessage(
                        datetime,
                    )}`}
                    customStyle={[
                        styles.textDatetime,
                        {color: theme.borderColor},
                    ]}
                />
            )}
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: '50@s',
    },
    textDatetime: {
        fontSize: '10@ms',
        marginTop: '5@vs',
    },
});

export default DatetimeMessage;
