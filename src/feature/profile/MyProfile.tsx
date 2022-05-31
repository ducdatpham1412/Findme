import {TypeCreateGroupResponse, TypeCreatePostResponse} from 'api/interface';
import {
    apiDeletePost,
    apiGetListMyGroups,
    apiGetListPost,
    apiGetProfile,
} from 'api/module';
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
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {modalizeMyProfile, modeExpUsePaging} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import ToolProfile from './components/ToolProfile';
import ListMyGroups from './group/ListMyGroups';
import PostStatus from './post/PostStatus';

interface ChildrenProps {
    routeName: string;
}

/** ------------------------
 * Profile Enjoy
 * -------------------------
 */
const ProfileEnjoy = ({routeName}: ChildrenProps) => {
    const {profile} = Redux.getPassport();

    const optionRef = useRef<any>(null);
    const bubblePalaceAction = Redux.getBubblePalaceAction();

    const {list, setList, onLoadMore} = modeExpUsePaging();
    const [listGroups, setListGroups] = useState<
        Array<TypeCreateGroupResponse>
    >([]);

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
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewGroupFromProfile
        ) {
            setListGroups(preValue =>
                [bubblePalaceAction.payload].concat(preValue),
            );
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editGroupFromProfile
        ) {
            setListGroups(preValue => {
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

    /**
     * Function
     */
    const onShowOption = () => {
        optionRef.current.show();
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

    const onDeleteAPostInList = async (idPost: string) => {
        const agreeDelete = async () => {
            try {
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

    /**
     * Render view
     */
    const HeaderComponent = () => {
        return (
            <>
                <InformationProfile
                    profile={profile}
                    routeName={routeName}
                    havingEditProfile
                    anonymousName={profile.anonymousName}
                />
                <ToolProfile />
            </>
        );
    };

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
            <>
                <ListMyGroups
                    listGroups={listGroups}
                    setListGroups={setListGroups}
                />
                <View style={styles.listBubbleView}>
                    <View style={{flex: 1}}>{left.map(RenderItemPost)}</View>
                    <View style={{flex: 1}}>{right.map(RenderItemPost)}</View>
                </View>
            </>
        );
    };

    return (
        <>
            <AvatarBackground avatar={profile.avatar} />

            <StyleList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={HeaderComponent()}
                ListFooterComponent={ListPostStatus()}
                ListEmptyComponent={() => null}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                onLoadMore={onLoadMore}
            />

            <SearchAndSetting
                onShowOptions={onShowOption}
                hasBackBtn={false}
                hasGuideButton
            />

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
            />
        </>
    );
};

/** ------------------------
 * Profile User
 * -------------------------
 */
const ProfileAccount = ({routeName}: ChildrenProps) => {
    const {profile} = Redux.getPassport();
    const bubblePalaceAction = Redux.getBubblePalaceAction();

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListPost,
        params: {
            userId: profile.id,
        },
    });
    const [listGroups, setListGroups] = useState<
        Array<TypeCreateGroupResponse>
    >([]);

    const optionRef = useRef<any>(null);

    const [left, setLeft] = useState<Array<TypeCreatePostResponse>>([]);
    const [right, setRight] = useState<Array<TypeCreatePostResponse>>([]);

    const getDataListGroups = async () => {
        try {
            const res = await apiGetListMyGroups();
            setListGroups(res.data);
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getDataListGroups();
    }, []);

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
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewGroupFromProfile
        ) {
            setListGroups(preValue =>
                [bubblePalaceAction.payload].concat(preValue),
            );
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editGroupFromProfile
        ) {
            setListGroups(preValue => {
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

    /**
     * Functions
     */
    const onShowOption = () => {
        optionRef.current.show();
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
            const res = await apiGetProfile(profile.id);
            Redux.updatePassport({
                profile: res.data,
            });
            onRefresh();
            getDataListGroups();
        } catch (err) {
            appAlert(err);
        }
    };

    /**
     * Render views
     */
    const HeaderComponent = () => {
        return (
            <>
                {/* Information: avatar, cover, follower, following */}
                <InformationProfile
                    profile={profile}
                    routeName={routeName}
                    havingEditProfile
                    anonymousName={profile.anonymousName}
                />

                {/* Add photo */}
                <ToolProfile />
            </>
        );
    };

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
            <>
                <ListMyGroups
                    listGroups={listGroups}
                    setListGroups={setListGroups}
                />
                <View style={styles.listBubbleView}>
                    <View style={{flex: 1}}>{left.map(RenderItemPost)}</View>
                    <View style={{flex: 1}}>{right.map(RenderItemPost)}</View>
                </View>
            </>
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
                onLoadMore={onLoadMore}
                refreshing={refreshing}
                onRefresh={onRefreshPage}
            />

            <SearchAndSetting
                onShowOptions={onShowOption}
                hasBackBtn={false}
                hasGuideButton
            />

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
            />
        </>
    );
};

/**
 * BOSS HERE
 */
const MyProfile = ({route}: any) => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    if (!isModeExp && token) {
        return <ProfileAccount routeName={route.name} />;
    }
    return <ProfileEnjoy routeName={route.name} />;
};

const styles = ScaledSheet.create({
    container: {
        flexGrow: 1,
        alignContent: 'center',
    },
    contentContainer: {
        paddingBottom: '100@vs',
    },
    listBubbleView: {
        width: '100%',
        flexDirection: 'row',
    },
});

export default MyProfile;
