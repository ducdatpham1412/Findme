import {TypeSendMessageFromProfile} from 'api/interface';
import {
    apiBlockUser,
    apiFollowUser,
    apiGetProfile,
    apiUnFollowUser,
} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import ListElementModalize from 'components/common/ListElementModalize';
import NoData from 'components/common/NoData';
import {useModalize} from 'components/common/useModalize';
import InformationProfile from 'feature/profile/components/InformationProfile';
import SearchAndSetting from 'feature/profile/components/SearchAndSetting';
import PostStatus from 'feature/profile/post/PostStatus';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {interactBubble, modalizeYourProfile} from 'utility/assistant';

interface Props {
    route: {
        params: {
            id: number;
        };
    };
}

const OtherDisProfile = ({route}: Props) => {
    const {id} = route.params;
    const modalize = useModalize();

    const myProfile = Redux.getPassport().profile;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const [idProfile, setIdProfile] = useState(id);
    const [profile, setProfile] = useState<any>(myProfile);
    const [search, setSearch] = useState('');

    const isMyProfile = idProfile === myProfile?.id;
    // const isFollowing = profile?.relationship === RELATIONSHIP.following;
    // const isNotFollowing = profile?.relationship === RELATIONSHIP.notFollowing;
    const [isFollowing, setIsFollowing] = useState(false);
    const isBlock = profile?.relationship === RELATIONSHIP.block;

    const getData = async () => {
        try {
            if (idProfile && !isModeExp) {
                const res = await apiGetProfile(idProfile);
                setIsFollowing(
                    res.data.relationship === RELATIONSHIP.following,
                );
                setProfile(res.data);
            }
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getData();
    }, [idProfile]);

    // follow
    const onFollowUser = async () => {
        try {
            if (idProfile) {
                await apiFollowUser(idProfile);
                setIsFollowing(true);
            }
        } catch (err) {
            appAlert(err);
        }
    };

    // on send message
    const onSendMessage = () => {
        if (profile?.name && profile.id && profile.avatar) {
            const itemBubble: TypeSendMessageFromProfile = {
                name: profile?.name,
                creatorId: profile?.id,
                creatorAvatar: profile?.avatar,
            };
            interactBubble(itemBubble, false);
        }
    };

    // on search
    const onSubmitSearch = () => {
        setIdProfile(parseInt(search));
    };

    const onBlockUser = async () => {
        try {
            await apiBlockUser(idProfile);
            modalize.dismiss();
        } catch (err) {
            appAlert(err);
        }
    };

    const onReport = async () => {
        appAlert('report');
    };

    // unFollow
    const onUnFollow = async () => {
        try {
            await apiUnFollowUser(idProfile);
            setIsFollowing(false);
            modalize.dismiss();
        } catch (err) {
            appAlert(err);
        }
    };

    const onShowOption = () => {
        modalize.show({
            children: (
                <ListElementModalize
                    listTextAndActions={modalizeYourProfile({
                        onBlockUser,
                        onReport,
                        onUnFollow,
                    })}
                />
            ),
        });
    };

    // render_view
    const headerComponent = () => {
        return (
            <>
                {/* INFORMATION PROFILE */}
                <InformationProfile profile={profile} />

                {/* VIEW BUTTON */}
                <View style={styles.btnInteractView}>
                    {/* BUTTON FOLLOW */}
                    {!isFollowing && !isMyProfile && (
                        <StyleTouchable
                            customStyle={[
                                styles.buttonEditProfile,
                                {borderColor: theme.borderColor},
                            ]}
                            onPress={onFollowUser}>
                            <StyleText
                                i18Text="profile.screen.follow"
                                customStyle={[
                                    styles.textEditProfile,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}

                    {/* BUTTON SEND MESSAGE */}
                    {!isMyProfile && (
                        <StyleTouchable
                            customStyle={[
                                styles.buttonEditProfile,
                                {borderColor: theme.borderColor},
                            ]}
                            onPress={onSendMessage}>
                            <StyleText
                                i18Text="profile.screen.sendMessage"
                                customStyle={[
                                    styles.textEditProfile,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}
                </View>
            </>
        );
    };

    const renderItem = ({item}: any) => {
        return <PostStatus itemPost={item} />;
    };

    return (
        <>
            {/* SEARCH, OPTIONS, SETTING BUTTON */}
            <SearchAndSetting
                search={search}
                onSearch={setSearch}
                onShowOptions={onShowOption}
                onSubmitSearch={onSubmitSearch}
                hasSettingBtn={false}
            />

            {isBlock && <NoData content="No Data" />}

            {/* INFORMATION PROFILE and LIST PHOTO */}
            {!isBlock && (
                <StyleList
                    data={[]}
                    keyExtractor={item => String(item)}
                    renderItem={renderItem}
                    ListHeaderComponent={headerComponent()}
                    style={[
                        styles.container,
                        {backgroundColor: theme.backgroundColor},
                    ]}
                />
            )}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flexGrow: 1,
        alignContent: 'center',
    },
    buttonActivityBox: {
        width: '100%',
        flexDirection: 'row',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActivity: {
        width: '70@s',
        height: '40@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20@s',
        marginTop: '30@vs',
    },
    iconButtonActivity: {
        fontSize: '30@ms',
    },
    //BUTTON EDIT PROFILE
    btnInteractView: {
        width: '100%',
        paddingHorizontal: '20@s',
        opacity: 0.7,
        flexDirection: 'row',
    },
    buttonEditProfile: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: '10@vs',
        paddingVertical: '4@vs',
        marginTop: '20@vs',
        marginHorizontal: '3@s',
    },
    textEditProfile: {
        fontSize: '10@vs',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    // BLOCK VIEW
    containerBlock: {
        flex: 1,
    },
});

export default OtherDisProfile;
