import {TypeCreatePostResponse} from 'api/interface';
import {apiDeletePost, apiGetListPost, apiGetProfile} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {modalizeMyProfile, modeExpUsePaging} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import SearchView from './components/SearchView';
import ToolProfile from './components/ToolProfile';
import PostStatus from './post/PostStatus';

const MyProfile = ({route}: any) => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const bubblePalaceAction = Redux.getBubblePalaceAction();

    const optionRef = useRef<any>(null);
    const [search, setSearch] = useState('');
    const [displaySearchView, setDisplaySearchView] = useState(false);

    const {list, setList, refreshing, onRefresh, onLoadMore} = isModeExp
        ? modeExpUsePaging()
        : usePaging({
              request: apiGetListPost,
              params: {
                  userId: profile.id,
              },
          });

    const [left, setLeft] = useState<Array<TypeCreatePostResponse>>([]);
    const [right, setRight] = useState<Array<TypeCreatePostResponse>>([]);

    useEffect(() => {
        const tempLeft: Array<TypeCreatePostResponse> = [];
        const tempRight: Array<TypeCreatePostResponse> = [];
        list.forEach((item: TypeCreatePostResponse, index: number) => {
            if (index % 2 === 0) {
                tempLeft.push(item);
            } else {
                tempRight.push(item);
            }
        });
        setLeft(tempLeft);
        setRight(tempRight);
    }, [list]);

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewPostFromProfile
        ) {
            setList((preValue: Array<TypeCreatePostResponse>) =>
                [bubblePalaceAction.payload].concat(preValue),
            );
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editPostFromProfile
        ) {
            setList((preValue: Array<TypeCreatePostResponse>) => {
                return preValue.map(item => {
                    if (item.id !== bubblePalaceAction.payload.id) {
                        return item;
                    }
                    return {
                        ...item,
                        ...bubblePalaceAction.payload,
                    };
                });
            });
        }
    }, [bubblePalaceAction]);

    const onShowOption = () => {
        optionRef.current.show();
    };

    const onSubmitSearch = () => {};

    const onDeleteAPostInList = async (idPost: string) => {
        const agreeDelete = async () => {
            try {
                await apiDeletePost(idPost);
                setList((preValue: Array<TypeCreatePostResponse>) => {
                    return preValue.filter(item => item.id !== idPost);
                });
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

    const onRefreshPage = async () => {
        try {
            if (!isModeExp) {
                const res = await apiGetProfile(profile.id);
                Redux.updatePassport({
                    profile: res.data,
                });
                onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onGoToDetailPost = (bubbleId: string) => {
        const temp = list.findIndex(item => item.id === bubbleId);
        const initIndex = temp < 0 ? 0 : temp;
        navigate(ROOT_SCREEN.listDetailPost, {
            listInProfile: list,
            initIndex,
            setListInProfile: setList,
        });
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
                    anonymousName={profile.anonymousName}
                />

                {/* Add photo */}
                <ToolProfile />
            </>
        );
    }, [profile, list, theme]);

    const RenderItemPost = useCallback(
        (item: TypeCreatePostResponse) => {
            return (
                <PostStatus
                    key={item.id}
                    itemPost={item}
                    deleteAPostInList={() => {
                        onDeleteAPostInList(item.id);
                    }}
                    onGoToDetailPost={onGoToDetailPost}
                />
            );
        },
        [list],
    );

    const ListPostStatus = () => {
        return (
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                }}>
                <View style={{flex: 1}}>{left.map(RenderItemPost)}</View>
                <View style={{flex: 1}}>{right.map(RenderItemPost)}</View>
            </View>
        );
    };

    return (
        <>
            <AvatarBackground avatar={profile.avatar} />

            <StyleList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={HeaderComponent}
                ListFooterComponent={ListPostStatus()}
                ListEmptyComponent={() => null}
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
                hasGuideButton
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
        flexGrow: 1,
        alignContent: 'center',
    },
    contentContainer: {
        paddingBottom: '100@vs',
    },
});

export default MyProfile;
