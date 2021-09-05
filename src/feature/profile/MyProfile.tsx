import {apiGetProfile} from 'api/module';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import ListElementModalize from 'components/common/ListElementModalize';
import {useModalize} from 'components/common/useModalize';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {modalizeMyProfile} from 'utility/assistant';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import PostStatus from './post/PostStatus';

const ProfileScreen = () => {
    const modalize = useModalize();

    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const [search, setSearch] = useState('');

    const getData = async () => {
        if (profile?.id) {
            const res = await apiGetProfile(profile?.id);
            Redux.updatePassport({profile: res.data});
        }
    };

    useEffect(() => {
        if (!isModeExp) {
            getData();
        }
    }, []);

    const onShowOption = () => {
        modalize.show({
            children: (
                <ListElementModalize listTextAndActions={modalizeMyProfile()} />
            ),
        });
    };

    const onSubmitSearch = () => {
        navigate(PROFILE_ROUTE.otherProfile, {
            id: parseInt(search),
        });
    };

    const addPhoto = async () => {
        appAlert('add photo');
    };

    // render_view
    const headerComponent = () => {
        return (
            <>
                {/* INFORMATION PROFILE */}
                <InformationProfile profile={profile} />

                {/* VIEW BUTTON */}
                <View style={styles.btnInteractView}>
                    {/* BUTTON EDIT PROFILE */}
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
                            customStyle={[
                                styles.textEditProfile,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>

                {/* BUTTON ADD PHOTO */}
                <View style={styles.buttonActivityBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonActivity,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={addPhoto}>
                        <Feather
                            name="plus"
                            style={[
                                styles.iconButtonActivity,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
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
                hasBackBtn={false}
            />

            {/* INFORMATION PROFILE and LIST PHOTO */}
            <StyleList
                data={[]}
                keyExtractor={item => String(item)}
                renderItem={renderItem}
                ListHeaderComponent={headerComponent()}
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}
                contentContainerStyle={styles.contentContainer}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
    },
    contentContainer: {
        paddingBottom: '200@vs',
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

export default ProfileScreen;
