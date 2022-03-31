import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface StyleTextProps extends TextProps {
    i18Text?: string;
    i18Params?: object;
    originValue?: any;
    customStyle?: StyleProp<TextStyle>;
    children?: ReactNode;
}

const StyleText = (props: StyleTextProps) => {
    const {i18Text, i18Params, originValue, customStyle, children} = props;
    const {t} = useTranslation();

    let valueText;
    if (i18Text) {
        valueText = t(i18Text, i18Params);
    } else if (originValue !== undefined) {
        valueText = originValue;
    } else {
        valueText = '';
    }

    return (
        <Text style={[styles.textDefaultStyle, customStyle]} {...props}>
            {valueText}
            {children}
        </Text>
    );
};

const styles = ScaledSheet.create({
    textDefaultStyle: {
        fontSize: '17@ms',
        color: 'lightgreen',
    },
});

export default StyleText;
