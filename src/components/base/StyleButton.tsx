import useRedux from 'hook/useRedux';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {StyleText} from '.';
import StyleTouchable from './StyleTouchable';

interface StyleTouchableProps {
    title: string;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    disable?: boolean;
    onPress?(): any;
}

const StyleButton = (props: StyleTouchableProps) => {
    const theme = useRedux().getTheme();
    const {title, containerStyle, titleStyle, disable, onPress} = props;

    return (
        <StyleTouchable
            customStyle={[
                styles.container,
                {borderColor: theme.borderColor},
                containerStyle,
            ]}
            onPress={onPress}
            disable={disable}>
            <StyleText
                i18Text={title || 'hehe'}
                customStyle={[
                    styles.title,
                    {color: theme.textColor},
                    titleStyle,
                ]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: '30@vs',
        paddingVertical: '15@vs',
        paddingHorizontal: '70@vs',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    title: {
        fontSize: 25,
    },
});

export default StyleButton;
