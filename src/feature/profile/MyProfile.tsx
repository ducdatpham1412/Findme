import {TypeCreatePostResponse} from 'api/interface';
import {apiDeletePost, apiGetListPost, apiGetProfile} from 'api/module';
import {StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {modalizeMyProfile, modeExpUsePaging} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import SearchView from './components/SearchView';
import PostStatus from './post/PostStatus';

const MyProfile = ({route}: any) => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const optionRef = useRef<any>(null);
    const [search, setSearch] = useState('');
    const [displaySearchView, setDisplaySearchView] = useState(false);

    const {list, setList, refreshing, onRefresh, onLoadMore} = isModeExp
        ? modeExpUsePaging
        : usePaging({
              request: apiGetListPost,
              params: {
                  userId: profile.id,
              },
          });

    const onShowOption = () => {
        optionRef.current.show();
    };

    const onSubmitSearch = () => {
        navigate(PROFILE_ROUTE.otherProfile, {
            id: parseInt(search),
            onGoBack: goBack,
        });
    };

    const addAPostToList = (newPost: TypeCreatePostResponse) => {
        setList([newPost].concat(list));
    };
    const onEditAPostInList = (params: {id: string; newContent: string}) => {
        const temp = list.map(item => {
            if (item.id !== params.id) {
                return item;
            }
            return {
                ...item,
                content: params.newContent,
            };
        });
        setList(temp);
    };
    const onDeleteAPostInList = async (idPost: string) => {
        const agreeDelete = async () => {
            try {
                await apiDeletePost(idPost);
                const temp = list.filter(item => item.id !== idPost);
                setList(temp);
                goBack();
            } catch (err) {
                appAlert(err);
            }
        };
        appAlertYesNo({
            i18Title: 'profile.post.sureDeletePost',
            agreeChange: agreeDelete,
            refuseChange: goBack,
        });
    };

    const onNavigateCreatePost = async () => {
        navigate(PROFILE_ROUTE.createPost, {
            addAPostToList,
        });
    };

    const onRefreshPage = async () => {
        try {
            if (!isModeExp) {
                const res = await apiGetProfile(profile.id);
                Redux.updatePassport({profile: res.data});
                onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    // render_view
    const HeaderComponent = useMemo(() => {
        return (
            <>
                {/* Information: avatar, cover, follower, following */}
                <InformationProfile
                    profile={profile}
                    routeName={route.name}
                    havingEditProfile
                />

                {/* Add photo */}
                <View style={styles.buttonActivityBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonActivity,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={onNavigateCreatePost}
                        disable={isModeExp}>
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
    }, [profile, list, theme]);

    const RenderItemPost = useCallback(
        ({item}: any) => {
            return (
                <PostStatus
                    itemPost={item}
                    editAPostInList={onEditAPostInList}
                    deleteAPostInList={() => {
                        onDeleteAPostInList(item.id);
                    }}
                />
            );
        },
        [list],
    );

    return (
        <>
            <AvatarBackground avatar={profile.avatar} />

            <StyleList
                data={list}
                keyExtractor={item => item.id}
                renderItem={RenderItemPost}
                ListHeaderComponent={HeaderComponent}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshing={refreshing}
                onRefresh={onRefreshPage}
                onLoadMore={onLoadMore}
            />

            {/* develop later */}
            {(displaySearchView || !!search) && false && <SearchView />}
            <SearchAndSetting
                search={search}
                onSearch={setSearch}
                onShowOptions={onShowOption}
                onSubmitSearch={onSubmitSearch}
                hasBackBtn={false}
                onFocus={() => setDisplaySearchView(true)}
                onBlur={() => setDisplaySearchView(false)}
            />

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '20@vs',
    },
    buttonActivity: {
        width: '35@s',
        height: '35@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10@s',
    },
    iconButtonActivity: {
        fontSize: '20@ms',
    },
});

export default MyProfile;
