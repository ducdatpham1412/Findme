import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import StyleText from 'components/base/StyleText';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {StyleIcon} from './base';

interface AlertConfirmChangeProps {
    route: {
        params: {
            i18Title: string;
            i18Params?: object;
            agreeChange(): void;
            refuseChange(): void;
        };
    };
}

const ButtonYesOrNo = (props: any) => {
    const {agreeChange, refuseChange} = props;
    const theme = Redux.getTheme();

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
                    i18Text="common.yes"
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
                    i18Text="common.no"
                    customStyle={styles.textButtonElement}
                />
            </TouchableOpacity>
        </View>
    );
};

/**
 * BOX HERE -----------------
 */
const AlertYesNo = ({route}: AlertConfirmChangeProps) => {
    const theme = Redux.getTheme();
    const {i18Title, i18Params, agreeChange, refuseChange} = route.params;
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={{position: 'absolute', width: '100%', height: '100%'}}
                onTouchEnd={goBack}
            />
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
                        i18Text={i18Title}
                        i18Params={i18Params}
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
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    notificationBox: {
        width: Metrics.width * 0.8,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: Metrics.width / 2,
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

export default AlertYesNo;
