import {TypeChatTagResponse} from 'api/interface';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import useCountdown from 'hook/useCountdown';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    route: {
        params: {
            publicChatTag: TypeChatTagResponse;
        };
    };
}

enum Time {
    areYouReady = 0,
    countDown = 1,
    bum = 2,
}

let x: any;

const PublicChatting = ({route}: Props) => {
    const {publicChatTag} = route.params;
    const theme = Redux.getTheme();

    const [time, setTime] = useState(Time.areYouReady);

    const {countdown, resetCountdown} = useCountdown(4);

    useEffect(() => {
        x = setTimeout(() => {
            clearTimeout(x);
            setTime(Time.countDown);
            resetCountdown();
            x = setTimeout(() => {
                clearTimeout(x);
                setTime(Time.bum);
            }, 3000);
        }, 2000);
    }, []);

    const onGoToProfile = (userId: number) => {
        navigate(ROOT_SCREEN.otherProfile, {
            id: userId,
        });
    };

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor,
                },
            ]}>
            <HeaderLeftIcon
                style={styles.buttonComebackView}
                onPress={goBack}
            />

            {time === Time.areYouReady && (
                <View style={styles.readyView}>
                    <StyleText
                        i18Text="mess.messScreen.areYouReady"
                        customStyle={[
                            styles.readyText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            )}

            {time === Time.countDown && (
                <View style={styles.readyView}>
                    <StyleText
                        originValue={countdown}
                        customStyle={[
                            styles.countdownText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            )}

            {time === Time.bum && (
                <>
                    <View style={styles.informationView}>
                        {publicChatTag.listUser.map(item => (
                            <StyleTouchable
                                key={item.id}
                                customStyle={styles.avatarNameView}
                                onPress={() => onGoToProfile(item.id)}>
                                <StyleImage
                                    source={{
                                        uri: item.avatar,
                                    }}
                                    customStyle={styles.avatarBox}
                                />
                                <StyleText
                                    originValue={item.name}
                                    customStyle={[
                                        styles.nameText,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </StyleTouchable>
                        ))}
                    </View>

                    <StyleImage
                        source={Images.images.squirrelLogin}
                        customStyle={styles.squirrelIcon}
                    />

                    <StyleText
                        i18Text="mess.messScreen.congratulation"
                        customStyle={[
                            styles.congratulationText,
                            {color: theme.borderColor},
                        ]}
                    />
                </>
            )}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: '20@vs',
        borderBottomWidth: 0,
    },
    buttonComebackView: {
        position: 'absolute',
        top: '15@vs',
        left: '15@s',
    },
    // are you ready
    readyView: {
        width: '100%',
        marginTop: '100@vs',
        alignItems: 'center',
    },
    readyText: {
        fontSize: '30@ms',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    // count_down
    countdownText: {
        fontSize: '80@ms',
        fontWeight: 'bold',
    },
    // bump
    informationView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '70@vs',
    },
    avatarNameView: {
        alignItems: 'center',
    },
    avatarBox: {
        width: Metrics.width * 0.25,
        height: Metrics.width * 0.25,
        borderRadius: '100@vs',
    },
    nameText: {
        fontSize: '18@ms',
        fontWeight: 'bold',
        marginTop: '10@vs',
    },
    congratulationText: {
        fontSize: '13@ms',
        fontStyle: 'italic',
        alignSelf: 'center',
        marginTop: '20@vs',
    },
    squirrelIcon: {
        width: '100@vs',
        height: '150@vs',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});

export default PublicChatting;
