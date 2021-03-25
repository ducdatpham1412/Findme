/* eslint-disable react-hooks/exhaustive-deps */
import StyleText from 'components/base/StyleText';
import useRedux from 'hook/useRedux';
import React, {useEffect, useRef} from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {selectBgCardStyle} from 'utility/assistant';

const {width, height} = Dimensions.get('screen');

interface AlertConfirmChangeProps {
    i18Content?: string;
    i18ContentParams?: object;
    agreeChange?(): any;
    refuseChange?(): any;
}

const ButtonYesOrNo = (props: AlertConfirmChangeProps) => {
    const {agreeChange, refuseChange} = props;
    const theme = useRedux().getTheme();
    return (
        <View style={styles.button}>
            {/* BUTTON YES */}
            <TouchableOpacity
                style={[
                    styles.buttonElement,
                    {backgroundColor: theme.borderColor},
                ]}
                onPress={agreeChange}>
                <StyleText
                    i18Text="setting.personalInfo.yes"
                    customStyle={styles.textButtonElement}
                />
            </TouchableOpacity>

            {/* BUTTON NO */}
            <TouchableOpacity
                style={[
                    styles.buttonElement,
                    {backgroundColor: theme.borderColor},
                ]}
                onPress={refuseChange}>
                <StyleText
                    i18Text="setting.personalInfo.no"
                    customStyle={styles.textButtonElement}
                />
            </TouchableOpacity>
        </View>
    );
};

/**
 * BOX HERE -----------------
 */
const AlertYesOrNo = (props: AlertConfirmChangeProps) => {
    const Redux = useRedux();

    const theme = Redux.getTheme();
    const {i18Content, i18ContentParams, agreeChange, refuseChange} = props;
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: selectBgCardStyle(theme, 0.6)},
            ]}>
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
                    <Image source={theme.icon.alert.default} />
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
                        i18Text={i18Content}
                        i18Params={i18ContentParams}
                        // i18Text="setting.personalInfo.alertCfChange1"
                        customStyle={[
                            styles.contentText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                <ButtonYesOrNo
                    agreeChange={agreeChange}
                    refuseChange={refuseChange}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width,
        height,
        alignItems: 'center',
        alignSelf: 'center',
    },
    notificationBox: {
        width: width * 0.8,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: width / 2,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    contentText: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    notice: {
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonElement: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: 100,
        minHeight: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%',
    },
    textButtonElement: {
        fontSize: 20,
        color: 'white',
    },
});

export default AlertYesOrNo;
