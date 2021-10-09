import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import StyleText from 'components/base/StyleText';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React, {ReactNode, useEffect, useRef} from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {StyleIcon} from './base';

interface AlertConfirmChangeProps {
    route: {
        params: {
            i18Title: string;
            i18Params?: object;
            agreeChange(): void;
            refuseChange(): void;
            headerNode?: ReactNode;
        };
    };
}

const ButtonYesOrNo = (props: any) => {
    const {agreeChange, refuseChange} = props;
    const theme = Redux.getTheme();

    return (
        <View style={styles.buttonView}>
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
    const {i18Title, i18Params, agreeChange, refuseChange, headerNode} =
        route.params;
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <>
            <View
                style={{position: 'absolute', width: '100%', height: '100%'}}
                onTouchEnd={goBack}
            />
            <Animated.View
                style={[
                    styles.body,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                        transform: [{scaleY: scale}],
                    },
                ]}>
                {/* Header */}
                <View
                    style={[
                        styles.headerView,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    {headerNode ? (
                        headerNode
                    ) : (
                        <>
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
                        </>
                    )}
                </View>

                {/* CONTENT OF NOTICE */}
                <View style={styles.noticeView}>
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
        </>
    );
};

const styles = ScaledSheet.create({
    body: {
        width: '75%',
        borderRadius: '30@s',
        paddingHorizontal: '20@s',
        marginTop: Metrics.width / 2,
        alignSelf: 'center',
    },
    // header view
    headerView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.25,
        paddingVertical: '10@vs',
    },
    headerText: {
        fontSize: '20@ms',
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    // notification view
    noticeView: {
        width: '100%',
        paddingBottom: '15@vs',
        paddingTop: '7@vs',
        alignItems: 'center',
    },
    contentText: {
        fontSize: '17@ms',
        fontStyle: 'italic',
    },
    // button view
    buttonView: {
        width: '100%',
        paddingBottom: '20@vs',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonElement: {
        paddingVertical: '5@vs',
        paddingHorizontal: '20@s',
        borderRadius: '15@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButtonElement: {
        fontSize: '17@ms',
        color: 'white',
    },
});

export default AlertYesNo;
