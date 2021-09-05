import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AvatarElement from './AvatarElement';
import CoverElement from './CoverElement';

const NameAndFollow = (props: any) => {
    const theme = Redux.getTheme();
    const {name} = props;
    const {followers, followings} = props.follow;

    return (
        <View style={styles.nameAndFollowBox}>
            {/* BOX FOLLOWER AND FOLLOWING */}
            <View style={styles.boxFollow}>
                {/* FOLLOWING */}
                <View style={styles.elementFollow}>
                    <StyleIcon
                        source={Images.icons.following}
                        size={23}
                        customStyle={[
                            styles.titleFollow,
                            {tintColor: theme.borderColor},
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

                {/* FOLLOWER */}
                <View style={styles.elementFollow}>
                    <StyleIcon
                        source={Images.icons.follower}
                        size={23}
                        customStyle={[
                            styles.titleFollow,
                            {tintColor: theme.borderColor},
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

                <View style={styles.spaceBox} />
            </View>

            {/* BOX NAME */}
            <View style={styles.boxName}>
                <StyleText
                    customStyle={[styles.textName, {color: theme.textColor}]}
                    originValue={name}
                />
            </View>
        </View>
    );
};

/**
 * BOSS HERE
 */
const InformationProfile = ({profile}: any) => {
    const theme = Redux.getTheme();
    const modeExp = Redux.getModeExp();
    const {name, description, avatar, cover, followers, followings} = profile;

    return (
        <View style={{width: '100%'}}>
            {/* AVATAR & COVER */}
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

            {/* NAME & FOLLOW  */}
            <NameAndFollow
                theme={theme}
                name={name}
                follow={{followers, followings}}
            />

            {/* INTRODUCE */}
            <View style={styles.introduceBox}>
                {/* INTRODUCE TEXT OF FIND ME */}
                {!!description && (
                    <StyleText
                        i18Text={description}
                        customStyle={[
                            styles.introduceText,
                            {color: theme.textColor},
                        ]}
                    />
                )}

                {/* IMAGE CUTE */}
                {modeExp && (
                    <StyleImage
                        customStyle={styles.imageTellSignUp}
                        source={Images.images.signUpNow}
                    />
                )}
                {/* BUTTON TELL TO SIGN UP */}
                {modeExp && (
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
                )}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    // AVATAR AND COVER BOX
    avatarAndCoverBox: {
        width: Metrics.width,
        height: Metrics.width / 2.8,
    },
    avatarElement: {
        width: Metrics.width / 3,
        height: Metrics.width / 3,
        position: 'absolute',
        left: '17@vs',
        bottom: -Metrics.width / 6,
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
        height: Metrics.width / 3.5,
        // backgroundColor: 'lightgreen',
    },
    boxFollow: {
        flex: 1,
        flexDirection: 'row-reverse',
    },
    elementFollow: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    titleFollow: {
        marginRight: '6@s',
    },
    numberFollow: {
        fontSize: '17@ms',
    },
    spaceBox: {
        width: Metrics.width / 3 + 50,
        height: '100%',
    },
    boxName: {
        flex: 1,
        paddingLeft: '20@s',
        justifyContent: 'flex-end',
    },
    textName: {
        fontSize: '20@ms',
        fontWeight: 'bold',
        marginTop: '5@vs',
    },

    // INTRODUCE STYLE
    introduceBox: {
        width: '100%',
        paddingHorizontal: '20@s',
        marginTop: '10@vs',
    },
    introduceText: {
        fontSize: '17@ms',
    },
    imageTellSignUp: {
        alignSelf: 'center',
        width: '20%',
    },
    buttonTellSignUp: {
        alignSelf: 'center',
        paddingHorizontal: '30@vs',
        paddingVertical: '8@vs',
        borderRadius: '50@vs',
    },
    textTellSignUp: {
        fontSize: '20@ms',
    },
});

export default InformationProfile;
