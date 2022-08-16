import {TypeCreatePostResponse} from 'api/interface';
import {apiGetListPost, apiGetProfile} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {modalizeMyProfile, modeExpUsePaging} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import ToolProfile from './components/ToolProfile';
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

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewPost
        ) {
            setList((preValue: Array<TypeCreatePostResponse>) =>
                [bubblePalaceAction.payload].concat(preValue),
            );
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
            allowSaveImage: true,
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
                />
                <ToolProfile />
            </>
        );
    };

    const RenderItemPost = (item: TypeCreatePostResponse) => {
        return (
            <PostStatus
                key={item.id}
                itemPost={item}
                onGoToDetailPost={onGoToDetailPost}
            />
        );
    };

    const ListPostStatus = () => {
        return (
            <View style={styles.listBubbleView}>
                {list.map(RenderItemPost)}
            </View>
        );
    };

    return (
        <>
            <AvatarBackground avatar={profile.avatar} />
            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red',
                }}
            />

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
    const theme = Redux.getTheme();

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListPost,
        params: {
            userId: profile.id,
        },
    });

    const optionRef = useRef<any>(null);

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewPost
        ) {
            setList((preValue: Array<TypeCreatePostResponse>) =>
                [bubblePalaceAction.payload].concat(preValue),
            );
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
            allowSaveImage: true,
        });
    };

    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(profile.id);
            Redux.updatePassport({
                profile: res.data,
            });
            onRefresh();
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
                />

                {/* Add photo */}
                <ToolProfile />
            </>
        );
    };

    const RenderItemPost = (item: TypeCreatePostResponse) => {
        return (
            <PostStatus
                key={item.id}
                itemPost={item}
                onGoToDetailPost={onGoToDetailPost}
            />
        );
    };

    const ListPostStatus = () => {
        return (
            <View style={styles.listBubbleView}>
                {list.map(RenderItemPost)}
            </View>
        );
    };

    return (
        <>
            <AvatarBackground avatar={profile.avatar} />

            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />

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
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    overlayView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.75,
    },
});

export default MyProfile;
