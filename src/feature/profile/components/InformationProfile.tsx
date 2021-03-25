/* eslint-disable react-native/no-inline-styles */
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AvatarElement from './AvatarElement';
import CoverElement from './CoverElement';

/**
 * INFORMATION_PROFILE CONTAIN 4 CHILDREN:
 * 1. AVATAR & COVER    2. NAME & FOLLOW    3. Introduce    4. Button edit profile
 */

const {width} = Dimensions.get('screen');

const AvatarAndCover = (props: any) => {
    const {avatar, cover} = props;

    return (
        <View style={styles.avatarAndCoverBox}>
            {/* AVATAR ELEMENT */}
            <AvatarElement
                avatar={avatar}
                customStyle={styles.avatarElement}
                imageStyle={styles.avatar}
            />

            {/* COVER ELEMENT */}
            <CoverElement cover={cover} customStyle={styles.coverElement} />
        </View>
    );
};

const NameAndFollow = (props: any) => {
    const theme = useRedux().getTheme();
    const {name} = props;
    const {followers, followings} = props.follow;

    return (
        <View style={styles.nameAndFollowBox}>
            {/* BOX NAME */}
            <View style={styles.boxName}>
                <StyleText
                    customStyle={[styles.textName, {color: theme.textColor}]}
                    originValue={name}
                />
            </View>

            {/* BOX FOLLOWER AND FOLLOWING */}
            <View style={styles.boxFollow}>
                {/* FOLLOWER */}
                <View style={styles.elementFollow}>
                    {/* TITLE FOLLOW */}
                    <StyleText
                        i18Text="profile.component.infoProfile.follower"
                        customStyle={[
                            styles.titleFollow,
                            {color: theme.borderColor},
                        ]}
                    />
                    {/* NUMBER FOLLOW */}
                    <StyleText
                        originValue={String(followers)}
                        customStyle={[
                            styles.numberFollow,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {/* FOLLOWING */}
                <View style={styles.elementFollow}>
                    {/* TITLE FOLLOW */}
                    <StyleText
                        i18Text="profile.component.infoProfile.following"
                        customStyle={[
                            styles.titleFollow,
                            {color: theme.borderColor},
                        ]}
                    />
                    {/* NUMBER FOLLOW */}
                    <StyleText
                        originValue={String(followings)}
                        customStyle={[
                            styles.numberFollow,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const Introduce = ({description}: any) => {
    const theme = useRedux().getTheme();
    const modeExp = useRedux().getModeExp();

    if (modeExp) {
        return (
            <View style={styles.introduceBox}>
                {/* INTRODUCE TEXT OF FIND ME */}
                <StyleText
                    i18Text={description}
                    customStyle={[
                        styles.introduceText,
                        {color: theme.textColor},
                    ]}
                />

                {/* IMAGE CUTE */}
                <StyleImage
                    customStyle={styles.imageTellSignUp}
                    source={theme.icon.profile.signUpNow}
                />

                {/* BUTTON TELL TO SIGN UP */}
                <StyleTouchable
                    customStyle={[
                        styles.buttonTellSignUp,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}
                    onPress={() => navigate(LOGIN_ROUTE.signUpType)}>
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

    return <View style={styles.introduceBox} />;
};

const ButtonEditProfile = () => {
    const theme = useRedux().getTheme();

    return (
        <StyleTouchable
            customStyle={[
                styles.buttonEditProfile,
                {borderColor: theme.borderColor},
            ]}
            onPress={() => {
                navigate(PROFILE_ROUTE.editProfile);
            }}>
            <StyleText
                i18Text="profile.component.infoProfile.editProfile"
                customStyle={[styles.textEditProfile, {color: theme.textColor}]}
            />
        </StyleTouchable>
    );
};

/**
 * BOSS HERE
 */
const InformationProfile = ({profile}: any) => {
    const theme = useRedux().getTheme();
    const {name, description, avatar, cover, followers, followings} = profile;

    return (
        <View style={{width: '100%'}}>
            <AvatarAndCover avatar={avatar} cover={cover} />

            <NameAndFollow
                theme={theme}
                name={name}
                follow={{followers, followings}}
            />

            <Introduce description={description} />

            <ButtonEditProfile />
        </View>
    );
};

const styles = ScaledSheet.create({
    // AVATAR AND COVER BOX
    avatarAndCoverBox: {
        width,
        height: width / 2.8,
    },
    avatarElement: {
        width: width / 3,
        height: width / 3,
        position: 'absolute',
        left: '17@vs',
        bottom: -width / 6,
        borderRadius: '200@vs',
        borderWidth: 4,
        zIndex: 9,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '200@vs',
    },
    coverElement: {
        flex: 1,
    },

    // NAME, FOLLOW
    nameAndFollowBox: {
        width: '100%',
        height: '100@vs',
        marginTop: '10@vs',
    },
    boxName: {
        width: '100%',
        height: '50@vs',
        position: 'absolute',
        bottom: 0,
        paddingLeft: '20@s',
        justifyContent: 'center',
    },
    textName: {
        fontSize: '27@ms',
        fontWeight: 'bold',
    },
    boxFollow: {
        width: (width * 2) / 3 - 50,
        position: 'absolute',
        top: '8@vs',
        right: 0,
        flexDirection: 'row',
    },
    elementFollow: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleFollow: {
        fontSize: '12.5@ms',
        fontWeight: 'bold',
        fontStyle: 'italic',
        paddingVertical: 5,
    },
    numberFollow: {
        fontSize: '12.5@ms',
    },

    // INTRODUCE STYLE
    introduceBox: {
        width: '100%',
        paddingHorizontal: '10@vs',
    },
    introduceText: {
        fontSize: '20@ms',
        lineHeight: '20@vs',
    },
    imageTellSignUp: {
        alignSelf: 'center',
    },
    buttonTellSignUp: {
        alignSelf: 'center',
        paddingHorizontal: '30@vs',
        paddingVertical: '13@vs',
        borderRadius: '50@vs',
        marginTop: '20@vs',
    },
    textTellSignUp: {
        fontSize: '20@ms',
    },

    //BUTTON EDIT PROFILE
    buttonEditProfile: {
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: '20@vs',
        paddingVertical: '5@vs',
        marginTop: '20@vs',
        marginBottom: '30@vs',
        opacity: 0.6,
    },
    textEditProfile: {
        fontSize: '13@vs',
        fontStyle: 'italic',
    },
});

export default InformationProfile;
