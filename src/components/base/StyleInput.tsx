import Redux from 'hook/useRedux';
import React, {forwardRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    StyleProp,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StyleText from './StyleText';

export interface StyleInputProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    i18Placeholder?: any;
    hasErrorBox?: boolean;
    label?: any;
    hasUnderLine?: boolean;
    customErrorBox?: StyleProp<ViewStyle>;
    customErrorText?: StyleProp<TextStyle>;
    errorMessage?: string;
}

const StyleInput = (props: StyleInputProps, ref: any) => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const {
        containerStyle,
        inputStyle,
        i18Placeholder,
        hasErrorBox = true,
        label,
        hasUnderLine = true,
        customErrorBox,
        customErrorText,
        errorMessage = '',
    } = props;
    const inputRef = useRef<TextInput>(null);

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                ref={ref || inputRef}
                style={[styles.input, {color: theme.textColor}, inputStyle]}
                placeholderTextColor={theme.holderColor}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                placeholder={t(i18Placeholder)}
                returnKeyType="next"
                keyboardAppearance={Redux.getThemeKeyboard()}
                {...props}
            />

            {hasErrorBox && (
                <View
                    style={[
                        styles.errorBox,
                        {
                            borderTopColor: theme.borderColor,
                            borderTopWidth: hasUnderLine ? 1 : 0,
                        },
                        customErrorBox,
                    ]}>
                    {!!errorMessage && (
                        <View style={styles.errorLabel}>
                            {label || (
                                <AntDesign
                                    name="warning"
                                    style={[
                                        styles.text,
                                        {color: theme.highlightColor},
                                        customErrorText,
                                    ]}
                                />
                            )}
                        </View>
                    )}

                    {!!errorMessage && (
                        <View style={styles.errorText}>
                            <StyleText
                                i18Text={errorMessage}
                                customStyle={[
                                    styles.text,
                                    {color: theme.highlightColor},
                                    customErrorText,
                                ]}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        alignSelf: 'center',
    },
    input: {
        fontSize: '20@ms',
        paddingHorizontal: '10@vs',
    },
    errorBox: {
        width: '100%',
        minHeight: '20@vs',
        marginTop: '5@vs',
        flexDirection: 'row',
        paddingHorizontal: '17@vs',
        paddingTop: '5@vs',
    },
    errorLabel: {
        flex: 1,
        justifyContent: 'center',
    },
    errorText: {
        flex: 7,
        justifyContent: 'center',
    },
    text: {
        fontSize: '13@ms',
    },
});

export default forwardRef(StyleInput);
