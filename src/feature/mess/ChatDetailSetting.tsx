import {TypeChatTagResponse} from 'api/interface';
import {
    apiBlockUser,
    apiOpenConversation,
    apiStopConversation,
    apiUnBlockUser,
} from 'api/module';
import {CHAT_TAG} from 'asset/enum';
import {
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import FlyButton from 'components/common/FlyButton';
import Redux from 'hook/useRedux';
import {
    blockAllChatTag,
    changeChatTheme,
    changeGroupName,
    openChatTag,
    stopChatTag,
    unBlockAllChatTag,
} from 'hook/useSocketIO';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN, {MAIN_SCREEN} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import {moveMeToEndOfListMember} from 'utility/assistant';
import ButtonChangeTheme from './components/ButtonChangeTheme';

interface Props {
    route: {
        params: {
            itemChatTag: TypeChatTagResponse;
        };
    };
}

const ChatDetailSetting = ({route}: Props) => {
    const routeItemChatTag = route.params.itemChatTag;

    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();
    const borderMessRoute = Redux.getBorderMessRoute();
    const chatTagFocusing = Redux.getChatTagFocusing();
    const theme = Redux.getTheme();
    const {id} = Redux.getPassport().profile;

    const listMembers = useMemo(() => {
        return moveMeToEndOfListMember(routeItemChatTag.listUser);
    }, [routeItemChatTag.listUser]);

    const isChatTagOfMe = useMemo(() => {
        if (routeItemChatTag.type === CHAT_TAG.group) {
            return false;
        }
        return listMembers[0]?.id === listMembers[1]?.id;
    }, []);

    const inputGroupNameRef = useRef<TextInput>(null);

    const [itemChatTag, setItemChatTag] = useState(routeItemChatTag);
    const [groupName, setGroupName] = useState(itemChatTag.groupName);
    const canChangeName = groupName !== itemChatTag.groupName;

    /**
     * Function
     */
    const onPressIconEditName = () => {
        const agreeChangeName = async () => {
            try {
                changeGroupName({
                    chatTagId: itemChatTag.id,
                    newName: groupName,
                });
                goBack();
                goBack();
            } catch (err) {
                appAlert(err);
            }
        };
        const refuseChangeName = () => {
            setGroupName(itemChatTag.groupName);
            goBack();
        };

        if (!inputGroupNameRef.current?.isFocused() && !canChangeName) {
            inputGroupNameRef.current?.focus();
        } else if (!canChangeName) {
            return;
        } else {
            inputGroupNameRef.current?.blur();
            appAlertYesNo({
                i18Title: 'alert.wantToChange',
                agreeChange: agreeChangeName,
                refuseChange: refuseChangeName,
            });
        }
    };

    const onChangeChatTheme = (newColor: number) => {
        changeChatTheme({
            newColor,
            chatTagId: chatTagFocusing,
        });
        setItemChatTag((preValue: TypeChatTagResponse) => ({
            ...preValue,
            color: newColor,
        }));
    };

    // go to partner profile
    const onGoToProfile = (userId: number) => {
        navigate(ROOT_SCREEN.otherProfile, {
            id: userId,
            onGoBack: () => {
                navigate(MAIN_SCREEN.messRoute);
            },
        });
    };

    const onBlockOrUnBlock = async () => {
        const agreeBlock = async () => {
            try {
                goBack();
                const listChatTagsBlock = await apiBlockUser(
                    listMembers[0]?.id,
                );
                blockAllChatTag({
                    listUserId: listMembers.map(item => item.id),
                    listChatTagId: listChatTagsBlock.data,
                });
                Redux.setShouldRenderOtherProfile(!shouldRenderOtherProfile);
                setItemChatTag({
                    ...itemChatTag,
                    isBlock: true,
                });
            } catch (err) {
                appAlert(err);
            }
        };

        try {
            if (itemChatTag.isBlock) {
                const listChatTagsOpen = await apiUnBlockUser(
                    listMembers[0].id,
                );
                unBlockAllChatTag({
                    listUserId: listMembers.map(item => item.id),
                    listChatTagId: listChatTagsOpen.data,
                });
                Redux.setShouldRenderOtherProfile(!shouldRenderOtherProfile);
                setItemChatTag({
                    ...itemChatTag,
                    isBlock: false,
                });
            } else {
                appAlertYesNo({
                    i18Title: 'mess.detailSetting.sureBlock',
                    agreeChange: agreeBlock,
                    refuseChange: goBack,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onStopOrOpenConversation = async () => {
        try {
            if (itemChatTag.isStop) {
                await apiOpenConversation(itemChatTag.id);
                openChatTag(itemChatTag.id);
                setItemChatTag({
                    ...itemChatTag,
                    isStop: false,
                });
            } else {
                await apiStopConversation(itemChatTag.id);
                stopChatTag(itemChatTag.id);
                setItemChatTag({
                    ...itemChatTag,
                    isStop: true,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onReportUser = () => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser: listMembers[0].id,
        });
    };

    const onGoBack = () => {
        if (inputGroupNameRef.current?.isFocused) {
            inputGroupNameRef.current.blur();
            const x = setTimeout(() => {
                goBack();
            }, 100);
            return () => clearTimeout(x);
        } else {
            goBack();
        }
    };

    /**
     * Render view
     */
    const RenderBlockOrUnBlock = useMemo(() => {
        if (itemChatTag.isBlock) {
            return {
                color: theme.highlightColor,
                icon: (
                    <AntDesign
                        name="unlock"
                        style={[styles.stopIcon, {color: theme.highlightColor}]}
                    />
                ),
                text: 'mess.detailSetting.unBlock',
            };
        }

        return {
            color: theme.borderColor,
            icon: (
                <Entypo
                    name="block"
                    style={[styles.stopIcon, {color: theme.borderColor}]}
                />
            ),
            text: 'mess.detailSetting.block',
        };
    }, [itemChatTag.isBlock]);

    const RenderStopOrOpen = useMemo(() => {
        if (itemChatTag.isStop) {
            return {
                color: theme.highlightColor,
                icon: (
                    <Octicons
                        name="stop"
                        style={[styles.stopIcon, {color: theme.highlightColor}]}
                    />
                ),
                text: 'mess.detailSetting.openConversation',
            };
        }

        return {
            color: theme.borderColor,
            icon: (
                <Octicons
                    name="stop"
                    style={[styles.stopIcon, {color: theme.borderColor}]}
                />
            ),
            text: 'mess.detailSetting.stopConversation',
        };
    }, [itemChatTag.isStop]);

    const RenderBtnBackAndChatTagName = () => {
        return (
            <View style={styles.headerView}>
                <HeaderLeftIcon
                    style={styles.iconBackView}
                    onPress={onGoBack}
                    iconStyle={{color: borderMessRoute}}
                />

                <View style={styles.groupNameView}>
                    <StyleInput
                        ref={inputGroupNameRef}
                        value={groupName}
                        onChangeText={text => setGroupName(text)}
                        containerStyle={[
                            styles.containerInputView,
                            {borderColor: borderMessRoute},
                        ]}
                        inputStyle={[styles.inputBox, {color: borderMessRoute}]}
                        hasErrorBox={false}
                        multiline
                        isEffectTabBar={false}
                    />
                    <StyleTouchable onPress={onPressIconEditName}>
                        {canChangeName ? (
                            <AntDesign
                                name="check"
                                style={[
                                    styles.iconEdit,
                                    {color: borderMessRoute},
                                ]}
                            />
                        ) : (
                            <AntDesign
                                name="edit"
                                style={[
                                    styles.iconEdit,
                                    {color: borderMessRoute},
                                ]}
                            />
                        )}
                    </StyleTouchable>
                </View>
            </View>
        );
    };

    const RenderListMember = () => {
        return (
            <View style={styles.listMemberView}>
                {listMembers.map(item => {
                    const color =
                        item.id === id
                            ? theme.highlightColor
                            : theme.borderColor;
                    return (
                        <StyleTouchable
                            customStyle={styles.memberBox}
                            onPress={() => onGoToProfile(item.id)}
                            disable={itemChatTag.isPrivate}
                            disableOpacity={0.7}>
                            <StyleImage
                                source={{uri: item.avatar}}
                                customStyle={[
                                    styles.imgAvatar,
                                    {
                                        borderColor: color,
                                    },
                                ]}
                            />
                            <View style={styles.nameTouch}>
                                <StyleText
                                    originValue={item.name}
                                    customStyle={[
                                        styles.nameText,
                                        {color: theme.textColor},
                                    ]}
                                    numberOfLines={1}
                                />
                            </View>
                        </StyleTouchable>
                    );
                })}
            </View>
        );
    };

    const RenderChangeTheme = () => {
        return (
            <ButtonChangeTheme
                colorNow={itemChatTag.color}
                onChangeChatTheme={onChangeChatTheme}
            />
        );
    };

    const RenderButtonFunction = () => {
        if (isChatTagOfMe || itemChatTag.type === CHAT_TAG.group) {
            return null;
        }
        return (
            <View style={styles.twoButtonView}>
                {/* Stop or open conversation */}
                <FlyButton
                    containerStyle={[
                        styles.buttonStop,
                        {
                            borderColor: RenderStopOrOpen.color,
                        },
                    ]}
                    onPress={onStopOrOpenConversation}>
                    {RenderStopOrOpen.icon}
                    <StyleText
                        i18Text={RenderStopOrOpen.text}
                        customStyle={[
                            styles.stopText,
                            {color: RenderStopOrOpen.color},
                        ]}
                    />
                </FlyButton>

                {/* Report */}
                <FlyButton
                    containerStyle={[
                        styles.buttonStop,
                        {borderColor: RenderBlockOrUnBlock.color},
                    ]}
                    onPress={onReportUser}>
                    <Octicons
                        name="report"
                        style={[
                            styles.stopIcon,
                            {color: RenderBlockOrUnBlock.color},
                        ]}
                    />
                    <StyleText
                        i18Text="mess.detailSetting.report"
                        customStyle={[
                            styles.stopText,
                            {color: RenderBlockOrUnBlock.color},
                        ]}
                    />
                </FlyButton>

                {/* Block user */}
                <FlyButton
                    containerStyle={[
                        styles.buttonStop,
                        {borderColor: RenderBlockOrUnBlock.color},
                    ]}
                    onPress={onBlockOrUnBlock}>
                    {RenderBlockOrUnBlock.icon}
                    <StyleText
                        i18Text={RenderBlockOrUnBlock.text}
                        customStyle={[
                            styles.stopText,
                            {color: RenderBlockOrUnBlock.color},
                        ]}
                    />
                </FlyButton>
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {RenderBtnBackAndChatTagName()}

            <StyleContainer scrollEnabled nestedScrollEnabled>
                {RenderListMember()}
                {RenderChangeTheme()}
                {RenderButtonFunction()}
            </StyleContainer>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    // headerView
    headerView: {
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: '20@s',
        marginTop: '20@vs',
    },
    iconBackView: {},
    // group name view
    groupNameView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    containerInputView: {
        width: '60%',
        borderBottomWidth: 1,
        paddingBottom: '5@vs',
    },
    inputBox: {
        fontSize: '17@ms',
    },
    iconEdit: {
        fontSize: '25@ms',
        marginLeft: '5@s',
    },
    // list members
    listMemberView: {
        width: '100%',
        marginTop: '10@vs',
    },
    memberBox: {
        width: '80%',
        flexDirection: 'row',
        marginTop: '20@vs',
        alignSelf: 'center',
    },
    imgAvatar: {
        width: '40@s',
        height: '40@s',
        borderRadius: '25@s',
        borderWidth: '2@s',
        marginHorizontal: '5@s',
    },
    nameTouch: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: '10@s',
    },
    nameText: {
        fontSize: '17@ms',
    },
    // button view
    buttonStop: {
        width: '50@s',
        height: '50@s',
    },
    stopIcon: {
        fontSize: '17@ms',
    },
    stopText: {
        fontSize: '7@ms',
        marginTop: '6@vs',
    },
    twoButtonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '80@vs',
    },
});

export default ChatDetailSetting;
