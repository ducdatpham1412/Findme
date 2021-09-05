import Images from 'asset/img/images';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {StyleIcon, StyleText} from './base';

/**
 * ALERT WILL SEND NOTICE TO USER
 * MOREOVER IT ALSO CONSIDER TO THE ELEMENT <MORE_BUTTON></MORE_BUTTON>
 */
const screenWidth = Dimensions.get('screen').width;

interface MoreButtonProps {
    notice: string;
}

const MoreButton = (props: MoreButtonProps) => {
    const theme = Redux.getTheme();
    const {notice} = props;

    if (
        notice === 'alert.clickHeartModeExp' ||
        notice === 'alert.clickPlusModeExp'
    ) {
        return (
            <TouchableOpacity
                style={[
                    styles.buttonElement,
                    {backgroundColor: theme.borderColor},
                ]}
                onPress={() => navigate(LOGIN_ROUTE.signUpType)}>
                <StyleText
                    i18Text="alert.moreButtonContent"
                    customStyle={styles.textButtonElement}
                />
            </TouchableOpacity>
        );
    } else {
        return <View />;
    }
};

/**
 * BOSS HERE
 */

const Alert = ({route}: any) => {
    const {notice, actionClickOk} = route.params;
    const theme = Redux.getTheme();

    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.notificationBox,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                        transform: [{scaleY: scale}],
                    },
                ]}>
                {/* IMAGE OWL AND HEADER */}
                <View style={styles.header}>
                    <StyleIcon
                        source={Images.icons.alert}
                        size={30}
                        customStyle={{tintColor: theme.borderColor}}
                    />
                    <StyleText
                        originValue="Alert"
                        customStyle={[
                            styles.headerText,
                            {color: theme.borderColor},
                        ]}
                    />
                </View>

                {/* CONTENT OF NOTICE */}
                <View style={styles.notice}>
                    <StyleText
                        i18Text={notice}
                        customStyle={[
                            styles.contentText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {/* BUTTON OK AND ONE_MORE IF POSSIBLE */}
                <View style={styles.buttonBox}>
                    {/* BUTTON OK */}
                    <TouchableOpacity
                        style={[
                            styles.buttonElement,
                            {backgroundColor: theme.borderColor},
                        ]}
                        onPress={actionClickOk || goBack}>
                        <StyleText
                            originValue="Ok"
                            customStyle={styles.textButtonElement}
                        />
                    </TouchableOpacity>

                    {/* BUTTON ONE_MORE IF CAN */}
                    <MoreButton notice={notice} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    notificationBox: {
        width: screenWidth * 0.8,
        borderRadius: '25@s',
        paddingVertical: '10@vs',
        paddingHorizontal: '17@s',
        marginTop: screenWidth / 2,
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '6@vs',
    },
    headerText: {
        fontSize: '23@ms',
        fontWeight: 'bold',
        marginLeft: '8@s',
    },
    contentText: {
        fontSize: '20@ms',
        fontStyle: 'italic',
    },
    notice: {
        width: '100%',
        paddingVertical: '10@vs',
        alignItems: 'center',
    },
    buttonBox: {
        width: '100%',
        paddingTop: '20@vs',
        paddingBottom: '10@vs',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonElement: {
        paddingVertical: '5@vs',
        paddingHorizontal: '20@s',
        borderRadius: '10@s',
        minWidth: '90@s',
        minHeight: '38@vs',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%',
    },
    textButtonElement: {
        fontSize: '18@ms',
        color: 'white',
    },
});

export default Alert;
