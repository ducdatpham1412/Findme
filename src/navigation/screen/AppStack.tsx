import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import {TypeBubblePalace} from 'api/interface';
import ModalPreviewLink from 'components/ModalPreviewLink';
import SwipeImages from 'components/SwipeImages';
import EditHistory from 'feature/common/EditHistory';
import PostsArchived from 'feature/common/PostsArchived';
import UpdatePrices from 'feature/common/UpdatePrices';
import UpgradeAccount from 'feature/common/UpgradeAccount';
import DetailGroupBuying from 'feature/discovery/DetailGroupBuying';
import InteractBubble from 'feature/discovery/InteractBubble';
import ReportUser from 'feature/discovery/ReportUser';
import ChatDetail from 'feature/mess/ChatDetail';
import ChatDetailSetting from 'feature/mess/ChatDetailSetting';
import DetailBubble from 'feature/notification/DetailBubble';
import CreateGroupBuying from 'feature/profile/CreateGroupBuying';
import CreatePostPickImage from 'feature/profile/CreatePostPickImage';
import CreatePostPreview from 'feature/profile/CreatePostPreview';
import ListFollows from 'feature/profile/ListFollows';
import MyProfile from 'feature/profile/MyProfile';
import OtherProfile from 'feature/profile/OtherProfile';
import Redux from 'hook/useRedux';
import StatusPostCreated from 'navigation/components/StatusPostCreated';
import ROOT_SCREEN, {MESS_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import MainAndChat from './MainAndChat';
import SettingRoute from './tabs/SettingRoute';

const modalPreviewLinkRef = React.createRef<ModalPreviewLink>();
export const showPreviewLink = (item: TypeBubblePalace) => {
    modalPreviewLinkRef.current?.show(item);
};

const Stack = createStackNavigator();

const AppStack = () => {
    const theme = Redux.getTheme();

    const cardStyle = {
        backgroundColor: theme.backgroundColor,
    };

    return (
        <>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name="main_and_chat"
                    component={MainAndChat}
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
                    name={PROFILE_ROUTE.updatePrices}
                    component={UpdatePrices}
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
                    name={ROOT_SCREEN.upgradeAccount}
                    component={UpgradeAccount}
                />
                <Stack.Screen
                    name={ROOT_SCREEN.editHistory}
                    component={EditHistory}
                />
            </Stack.Navigator>

            <StatusPostCreated />
            <ModalPreviewLink ref={modalPreviewLinkRef} theme={theme} />
        </>
    );
};

export default AppStack;
