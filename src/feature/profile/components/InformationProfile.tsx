import {TypeGetProfileResponse} from 'api/interface';
import {TYPE_FOLLOW} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate, push} from 'navigation/NavigationService';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {onGoToSignUp} from 'utility/assistant';

interface Props {
    profile: TypeGetProfileResponse;
    routeName: string;
    havingEditProfile?: boolean;
    anonymousName?: string;
}

const InformationProfile = (props: Props) => {
    const {profile, routeName, havingEditProfile, anonymousName} = props;

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const {name, description, followers, followings} = profile;

    const onNavigateFollow = (type: number) => {
        push(ROOT_SCREEN.listFollows, {
            userId: profile.id,
            name: profile.name,
            type,
            onGoBack: () => navigate(routeName),
        });
    };

    /**
     * Render view
     */
    const RenderBackground = useMemo(() => {
        return (
            <View
                style={[
                    styles.introduceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    }, [theme]);

    const RenderIndicator = useMemo(() => {
        return (
            <View
                style={[
                    styles.indicatorBox,
                    {backgroundColor: theme.borderColor},
                ]}
            />
        );
    }, [theme]);

    const RenderNameAndDescription = useMemo(() => {
        return (
            <View style={styles.boxNameAndDescription}>
                <StyleText
                    customStyle={[
                        styles.textName,
                        {color: theme.textHightLight},
                    ]}
                    originValue={name}
                />
                {!!anonymousName && (
                    <StyleText
                        customStyle={[
                            styles.textNameAnonymous,
                            {color: theme.textColor},
                        ]}
                        originValue={`@${anonymousName}`}
                    />
                )}
                {!!description && (
                    <StyleText
                        i18Text={description}
                        customStyle={[
                            styles.textDescription,
                            {color: theme.textHightLight},
                        ]}
                    />
                )}
            </View>
        );
    }, [name, anonymousName, description, theme]);

    const RenderFollow = useMemo(() => {
        return (
            <View
                style={[styles.followBox, {borderTopColor: theme.borderColor}]}>
                {/* Follower */}
                <StyleTouchable
                    customStyle={styles.elementFollow}
                    onPress={() => onNavigateFollow(TYPE_FOLLOW.follower)}>
                    <StyleText
                        i18Text="profile.component.infoProfile.follower"
                        customStyle={[
                            styles.titleFollow,
                            {color: theme.borderColor},
                        ]}
                    />
                    {/* Number follows */}
                    <StyleText
                        originValue={String(followers)}
                        customStyle={[
                            styles.numberFollow,
                            {color: theme.textHightLight},
                        ]}
                    />
                </StyleTouchable>

                {/* Following */}
                <StyleTouchable
                    customStyle={styles.elementFollow}
                    onPress={() => onNavigateFollow(TYPE_FOLLOW.following)}>
                    <StyleText
                        i18Text="profile.component.infoProfile.following"
                        customStyle={[
                            styles.titleFollow,
                            {color: theme.borderColor},
                        ]}
                    />
                    {/* Number follows */}
                    <StyleText
                        originValue={String(followings)}
                        customStyle={[
                            styles.numberFollow,
                            {color: theme.textHightLight},
                        ]}
                    />
                </StyleTouchable>
            </View>
        );
    }, [followers, followings, theme]);

    const RenderImageTellSignUp = useMemo(() => {
        if (isModeExp) {
            return (
                <View style={styles.signUpBox}>
                    <StyleImage
                        customStyle={styles.imageTellSignUp}
                        source={Images.images.signUpNow}
                        resizeMode="contain"
                    />

                    <StyleTouchable
                        customStyle={[
                            styles.buttonTellSignUp,
                            {backgroundColor: theme.highlightColor},
                        ]}
                        onPress={onGoToSignUp}>
                        <StyleText
                            i18Text="profile.component.infoProfile.tellSignUp"
                            customStyle={[
                                styles.textTellSignUp,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            );
        }
        return null;
    }, [isModeExp, theme]);

    const RenderButtonEditProfile = useMemo(() => {
        if (havingEditProfile) {
            return (
                <StyleTouchable
                    customStyle={[
                        styles.editProfileBox,
                        {backgroundColor: theme.tabBarIconColor},
                    ]}
                    onPress={() => navigate(PROFILE_ROUTE.editProfile)}>
                    <AntDesign
                        name="edit"
                        style={[
                            styles.editProfileIcon,
                            {color: theme.backgroundColor},
                        ]}
                    />
                </StyleTouchable>
            );
        }
        return null;
    }, [havingEditProfile, theme]);

    return (
        <View style={styles.container}>
            <View style={styles.introduceView}>
                {RenderBackground}
                {RenderIndicator}
                {RenderNameAndDescription}
                {RenderFollow}
                {RenderButtonEditProfile}
            </View>

            {RenderImageTellSignUp}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingTop: Metrics.height / 2,
    },
    indicatorBox: {
        width: '50%',
        height: '3@vs',
        borderRadius: '20@s',
        alignSelf: 'center',
    },
    editProfileBox: {
        position: 'absolute',
        padding: '10@s',
        borderRadius: '50@s',
        top: '17@s',
        right: '17@s',
    },
    editProfileIcon: {
        fontSize: '18@ms',
    },
    // avatar - cover
    introduceView: {
        width: Metrics.width,
        minHeight: Metrics.width / 2,
    },
    introduceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: '30@s',
        borderTopRightRadius: '30@s',
        opacity: 0.7,
    },
    // box name
    boxNameAndDescription: {
        width: '100%',
        alignItems: 'center',
        paddingTop: '20@vs',
        paddingHorizontal: '15@s',
    },
    textName: {
        fontSize: '30@ms',
        fontWeight: 'bold',
    },
    textNameAnonymous: {
        fontSize: '13@ms',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: '7@vs',
    },
    textDescription: {
        fontSize: '15@ms',
        marginTop: '25@vs',
    },
    // box follow
    followBox: {
        width: '70%',
        alignSelf: 'center',
        flexDirection: 'row',
        paddingVertical: '10@vs',
        justifyContent: 'center',
        marginTop: '25@vs',
        borderTopWidth: '1@ms',
    },
    elementFollow: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleFollow: {
        fontSize: '13@ms',
    },
    numberFollow: {
        fontSize: '40@ms',
        fontWeight: 'bold',
        marginTop: '5@vs',
    },
    // sign up now
    signUpBox: {
        width: '100%',
        height: '100@s',
        marginTop: '20@vs',
    },
    imageTellSignUp: {
        position: 'absolute',
        right: '30@s',
        width: '100@s',
        height: '100@s',
    },
    buttonTellSignUp: {
        position: 'absolute',
        right: '140@s',
        top: '50@s',
        paddingHorizontal: '30@vs',
        paddingVertical: '8@vs',
        borderRadius: '50@vs',
    },
    textTellSignUp: {
        fontSize: '15@ms',
    },
});

export default InformationProfile;
