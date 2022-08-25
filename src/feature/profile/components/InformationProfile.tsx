import {TypeGetProfileResponse} from 'api/interface';
import {TYPE_FOLLOW} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate, push} from 'navigation/NavigationService';
import React from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    profile: TypeGetProfileResponse;
    routeName: string;
    havingEditProfile?: boolean;
}

const InformationProfile = (props: Props) => {
    const {profile, routeName, havingEditProfile} = props;

    const theme = Redux.getTheme();
    const {name, description, followers, followings, avatar} = profile;

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
    const RenderBackground = () => {
        return (
            <View
                style={[
                    styles.introduceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    };

    const RenderIndicator = () => {
        return (
            <View
                style={[
                    styles.indicatorBox,
                    {backgroundColor: theme.borderColor},
                ]}
            />
        );
    };

    const RenderFollow = () => {
        return (
            <View
                style={[styles.followBox, {borderTopColor: theme.holderColor}]}>
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
    };

    const RenderButtonEditProfile = () => {
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
    };

    return (
        <View style={styles.container}>
            <View style={styles.introduceView}>
                {RenderBackground()}

                {RenderIndicator()}

                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatarHeader}
                    defaultSource={Images.images.defaultAvatar}
                />

                <View style={styles.boxNameAndDescription}>
                    <StyleText
                        customStyle={[
                            styles.textName,
                            {color: theme.textHightLight},
                        ]}
                        originValue={name}
                    />
                    {!!description && (
                        <StyleText
                            originValue={description}
                            customStyle={[
                                styles.textDescription,
                                {color: theme.textHightLight},
                            ]}
                        />
                    )}
                </View>
                {RenderFollow()}
                {RenderButtonEditProfile()}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginTop: Metrics.width / 1.5,
    },
    avatarHeader: {
        width: '70@s',
        height: '70@s',
        borderRadius: '50@s',
        alignSelf: 'center',
        marginTop: '10@vs',
    },
    indicatorBox: {
        width: '50%',
        height: '2.5@vs',
        borderRadius: '20@s',
        alignSelf: 'center',
    },
    editProfileBox: {
        position: 'absolute',
        padding: '7@ms',
        borderRadius: '50@s',
        top: '17@s',
        right: '17@s',
    },
    editProfileIcon: {
        fontSize: '16@ms',
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
        borderTopLeftRadius: '20@s',
        borderTopRightRadius: '20@s',
        opacity: 0.95,
    },
    // box name
    boxNameAndDescription: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: '15@s',
        marginTop: '5@vs',
    },
    textName: {
        fontSize: '17@ms',
        fontWeight: 'bold',
    },
    nameAnonymousBox: {
        marginTop: '7@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textDescription: {
        fontSize: '13@ms',
        marginTop: '15@vs',
    },
    // box follow
    followBox: {
        width: '70%',
        alignSelf: 'center',
        flexDirection: 'row',
        paddingVertical: '10@vs',
        justifyContent: 'center',
        marginTop: '15@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
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
        fontSize: '25@ms',
        fontWeight: 'bold',
        marginTop: '5@vs',
    },
});

export default InformationProfile;
