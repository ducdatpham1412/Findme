import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';
import HeaderLeftIcon from './HeaderLeftIcon';

interface Props {
    title: string;
    onGoBack?(): void;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
}

const StyleHeader = (props: Props) => {
    const {title, onGoBack, containerStyle, titleStyle, iconStyle} = props;

    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    borderBottomColor: theme.borderColor,
                },
                containerStyle,
            ]}>
            <StyleText
                i18Text={title}
                customStyle={[
                    styles.titleText,
                    {color: theme.textColor},
                    titleStyle,
                ]}
            />

            <HeaderLeftIcon
                style={styles.headerLeft}
                onPress={onGoBack || goBack}
                iconStyle={iconStyle}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingBottom: '7@vs',
        paddingTop: '3@vs',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: isIOS ? 0.25 : 0.5,
    },
    titleText: {
        fontSize: '17@ms',
        fontWeight: 'bold',
    },
    headerLeft: {
        position: 'absolute',
        left: '10@s',
    },
});

export default StyleHeader;
