import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import SwipeImages from 'components/SwipeImages';
import InteractBubble from 'feature/discovery/InteractBubble';
import ReportUser from 'feature/discovery/ReportUser';
import ChatDetail from 'feature/mess/ChatDetail';
import ChatDetailSetting from 'feature/mess/ChatDetailSetting';
import DetailBubble from 'feature/notification/DetailBubble';
import CreatePostPreview from 'feature/profile/CreatePostPreview';
import CreatePostPickImage from 'feature/profile/CreatePostPickImage';
import ListFollows from 'feature/profile/ListFollows';
import OtherProfile from 'feature/profile/OtherProfile';
import Redux from 'hook/useRedux';
import StatusPostCreated from 'navigation/components/StatusPostCreated';
import ROOT_SCREEN, {MESS_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import DetailGroupBuying from 'feature/discovery/DetailGroupBuying';
import MyProfile from 'feature/profile/MyProfile';
import PostsArchived from 'feature/common/PostsArchived';
import GroupBuyingJoined from 'feature/common/GroupBuyingJoined';
import UpgradeAccount from 'feature/common/UpgradeAccount';
import ModalPreviewLink from 'components/ModalPreviewLink';
import {TypeBubblePalace} from 'api/interface';
import CreateGroupBuying from 'feature/profile/CreateGroupBuying';
import ModalCommentLike, {
    TypeModalCommentPost,
} from 'components/ModalCommentLike';
import FindmeStore from 'app-redux/store';
import MainTabs from './MainTabs';
import SettingRoute from './tabs/SettingRoute';

const modalPreviewLinkRef = React.createRef<ModalPreviewLink>();
export const showPreviewLink = (item: TypeBubblePalace) => {
    modalPreviewLinkRef.current?.show(item);
};

const modalRef = React.createRef<ModalCommentLike>();
export const showCommentDiscovery = (params: TypeModalCommentPost) => {
    modalRef.current?.show(params);
};

const Stack = createStackNavigator();

const AppStack = () => {
    const theme = Redux.getTheme();
    const bubbleFocusing = Redux.getBubbleFocusing();

    const cardStyle = {
        backgroundColor: theme.backgroundColor,
    };

    return (
        <>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name={ROOT_SCREEN.mainScreen}
                    component={MainTabs}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forHorizontalIOS,
                    }}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.otherProfile}
                    component={OtherProfile}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.listFollows}
                    component={ListFollows}
                />

                <Stack.Screen
                    name={ROOT_SCREEN.detailBubble}
                    component={DetailBubble}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.detailGroupBuying}
                    component={DetailGroupBuying}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forRevealFromBottomAndroid,
                    }}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.myProfile}
                    component={MyProfile}
                />

                {/* Interact Bubble */}
                <Stack.Screen
                    options={{
                        cardStyle: [
                            {backgroundColor: theme.backgroundOpacity(0.3)},
                        ],
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                    }}
                    name={ROOT_SCREEN.interactBubble}
                    component={InteractBubble}
                />

                {/* Swipe Image */}
                <Stack.Screen
                    options={{
                        cardStyle,
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                    }}
                    name={ROOT_SCREEN.swipeImages}
                    component={SwipeImages}
                />

                <Stack.Screen
                    name={ROOT_SCREEN.reportUser}
                    component={ReportUser}
                />

                <Stack.Screen
                    name={PROFILE_ROUTE.settingRoute}
                    component={SettingRoute}
                />

                <Stack.Screen
                    name={PROFILE_ROUTE.createPostPreview}
                    component={CreatePostPreview}
                    options={{
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name={PROFILE_ROUTE.createPostPickImg}
                    component={CreatePostPickImage}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forVerticalIOS,
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name={PROFILE_ROUTE.createGroupBuying}
                    component={CreateGroupBuying}
                    options={{
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name={MESS_ROUTE.chatDetail}
                    component={ChatDetail}
                />
                {/* <Stack.Screen
                    name={MESS_ROUTE.chatDetailGroup}
                    component={ChatDetailGroup}
                    options={{
                        gestureEnabled: isIOS,
                    }}
                /> */}
                <Stack.Screen
                    name={MESS_ROUTE.chatDetailSetting}
                    component={ChatDetailSetting}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.postsArchived}
                    component={PostsArchived}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.gBJoined}
                    component={GroupBuyingJoined}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.upgradeAccount}
                    component={UpgradeAccount}
                />
            </Stack.Navigator>

            <StatusPostCreated />
            <ModalPreviewLink ref={modalPreviewLinkRef} theme={theme} />
            <ModalCommentLike
                ref={modalRef}
                theme={theme}
                bubbleFocusing={bubbleFocusing}
                updateBubbleFocusing={value =>
                    Redux.updateBubbleFocusing(value)
                }
                setTotalComments={value => {
                    Redux.updateBubbleFocusing({
                        totalComments: value,
                    });
                }}
                increaseTotalComments={value => {
                    const currentComments =
                        FindmeStore.getState().logicSlice.bubbleFocusing
                            .totalComments;
                    Redux.updateBubbleFocusing({
                        totalComments: currentComments + value,
                    });
                }}
            />
        </>
    );
};

export default AppStack;
