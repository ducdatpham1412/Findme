import {useRoute} from '@react-navigation/native';
import {TypeGetProfileResponse} from 'api/interface';
import {ACCOUNT, TYPE_FOLLOW} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate, push} from 'navigation/NavigationService';
import React from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
    profile: TypeGetProfileResponse;
    havingEditProfile?: boolean;
}

const InformationProfile = (props: Props) => {
    const route = useRoute();
    const {profile, havingEditProfile} = props;
    const theme = Redux.getTheme();
    const {name, description, followers, followings, avatar, account_type} =
        profile;

    const onNavigateFollow = (type: number) => {
        push(ROOT_SCREEN.listFollows, {
            userId: profile.id,
            name: profile.name,
            type,
            onGoBack: () => navigate(route.name),
        });
    };

    /**
     * Render view
     */
    const Follows = () => {
        return (
            <View
                style={[
                    styles.followBox,
                    {
                        borderTopColor: theme.holderColor,
                        width: profile.reputations ? '90%' : '70%',
                    },
                ]}>
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
                    <StyleText
                        originValue={String(followings)}
                        customStyle={[
                            styles.numberFollow,
                            {color: theme.textHightLight},
                        ]}
                    />
                </StyleTouchable>

                {/* Reputations */}
                {!!profile.reputations && (
                    <View style={styles.elementFollow}>
                        <StyleText
                            originValue="TrustPoint"
                            customStyle={[
                                styles.titleFollow,
                                {color: theme.borderColor},
                            ]}
                        />
                        <StyleText
                            originValue={profile.reputations}
                            customStyle={[
                                styles.numberFollow,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                )}
            </View>
        );
    };

    const ButtonEditProfile = () => {
        return (
            <>
                {havingEditProfile && (
                    <StyleTouchable
                        customStyle={[
                            styles.editProfileBox,
                            {borderColor: theme.tabBarIconColor},
                        ]}
                        onPress={() => navigate(PROFILE_ROUTE.editProfile)}>
                        <AntDesign
                            name="edit"
                            style={[
                                styles.editProfileIcon,
                                {color: theme.tabBarIconColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {account_type === ACCOUNT.shop && (
                    <View
                        style={[
                            styles.shopButtonBox,
                            {borderColor: theme.borderColor},
                        ]}>
                        <Entypo
                            name="shop"
                            style={[
                                styles.editProfileIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                )}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.introduceView}>
                <View
                    style={[
                        styles.introduceBackground,
                        {backgroundColor: theme.backgroundColor},
                    ]}
                />

                <View
                    style={[
                        styles.indicatorBox,
                        {backgroundColor: theme.borderColor},
                    ]}
                />

                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatarHeader}
                />

                <View style={styles.boxNameAndDescription}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <StyleText
                            customStyle={[
                                styles.textName,
                                {color: theme.textHightLight},
                            ]}
                            originValue={name}
                        />
                    </View>
                    {!!description && (
                        <StyleText
                            originValue={description}
                            customStyle={[
                                styles.textDescription,
                                {color: theme.textHightLight},
                            ]}
                        />
                    )}
                    {!!profile.location && (
                        <View style={styles.locationBox}>
                            <Ionicons
                                name="location"
                                style={styles.iconLocation}
                            />
                            <StyleText
                                originValue={profile.location}
                                customStyle={[
                                    styles.textLocation,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </View>
                    )}
                </View>
                {Follows()}
                {ButtonEditProfile()}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginTop: Metrics.width / 2.5,
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
        borderWidth: '1@ms',
    },
    shopButtonBox: {
        position: 'absolute',
        padding: '7@ms',
        borderRadius: '50@s',
        top: '17@s',
        left: '17@s',
        borderWidth: '1@ms',
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
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
    },
    nameAnonymousBox: {
        marginTop: '7@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textDescription: {
        fontSize: FONT_SIZE.normal,
        marginTop: '10@vs',
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
        maxWidth: '80%',
    },
    iconLocation: {
        fontSize: '17@ms',
        color: Theme.common.commentGreen,
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        marginLeft: '5@s',
    },
    // box follow
    followBox: {
        alignSelf: 'center',
        flexDirection: 'row',
        paddingTop: '10@vs',
        marginVertical: '15@vs',
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
        fontSize: FONT_SIZE.small,
    },
    numberFollow: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginTop: '8@vs',
    },
});

export default InformationProfile;
