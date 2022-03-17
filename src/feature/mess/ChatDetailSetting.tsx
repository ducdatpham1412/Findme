import {TypeChatTagResponse} from 'api/interface';
import {
    apiBlockUser,
    apiOpenConversation,
    apiStopConversation,
    apiUnBlockUser,
} from 'api/module';
import {
    StyleContainer,
    StyleIcon,
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
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import {moveMeToEndOfListMember, renderIconGender} from 'utility/assistant';
import ButtonChangeTheme from './components/ButtonChangeTheme';

interface Props {
    route: {
        params: {
            itemChatTag: TypeChatTagResponse;
        };
    };
}

const ChatDetailSetting = ({route}: Props) => {
    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();
    const borderMessRoute = Redux.getBorderMessRoute();
    const chatTagFocusing = Redux.getChatTagFocusing();
    const theme = Redux.getTheme();
    const {id} = Redux.getPassport().profile;

    const listMembers = useMemo(() => {
        return moveMeToEndOfListMember(route.params.itemChatTag.listUser);
    }, [route.params.itemChatTag.listUser]);
    const isChatTagOfMe = useMemo(() => {
        return listMembers[0].id === listMembers[1].id;
    }, [listMembers]);

    const inputGroupNameRef = useRef<TextInput>(null);

    const [itemChatTag, setItemChatTag] = useState(route.params.itemChatTag);
    const [groupName, setGroupName] = useState(itemChatTag.groupName);
    const canChangeName = groupName !== itemChatTag.groupName;

    /**
     * Function
     */
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

    const onPressIconEditName = () => {
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

    const onChangeChatTheme = useCallback(
        (newColor: number) => {
            changeChatTheme({
                newColor,
                chatTagId: chatTagFocusing,
            });
            setItemChatTag((preValue: TypeChatTagResponse) => ({
                ...preValue,
                color: newColor,
            }));
        },
        [chatTagFocusing],
    );

    // go to partner profile
    const onGoToProfile = useCallback(() => {
        navigate(ROOT_SCREEN.otherProfile, {
            id: listMembers[0].id,
            onGoBack: () => {
                navigate(MAIN_SCREEN.messRoute);
            },
        });
    }, [listMembers[0].id]);

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

    const onReportUser = useCallback(() => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser: listMembers[0].id,
        });
    }, [listMembers[0].id]);

    const onGoBack = useCallback(() => {
        if (inputGroupNameRef.current?.isFocused) {
            inputGroupNameRef.current.blur();
            const x = setTimeout(() => {
                goBack();
            }, 100);
            return () => clearTimeout(x);
        } else {
            goBack();
        }
    }, []);

    /**
     * Render view
     */
    const RenderListMember = useMemo(() => {
        return (
            <>
                {listMembers.map(item => (
                    <StyleImage
                        source={{uri: item.avatar}}
                        customStyle={[
                            styles.imgAvatar,
                            {
                                borderColor:
                                    item.id === id
                                        ? theme.highlightColor
                                        : theme.borderColor,
                            },
                        ]}
                    />
                ))}
            </>
        );
    }, []);

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

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {/* Header */}
            <View style={styles.headerView}>
                <HeaderLeftIcon
                    style={styles.iconBackView}
                    onPress={onGoBack}
                    iconStyle={{color: borderMessRoute}}
                />
                <View style={styles.listMemberBox}>{RenderListMember}</View>
            </View>

            {/* Content */}
            <StyleContainer scrollEnabled nestedScrollEnabled>
                {/* Group name */}
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

                {/* Button profile
                check icon follow gender of my partner */}
                <FlyButton
                    containerStyle={[
                        styles.buttonProfile,
                        {borderColor: borderMessRoute},
                    ]}
                    disable={itemChatTag.isPrivate || itemChatTag.isBlock}
                    onPress={onGoToProfile}>
                    <StyleIcon
                        source={renderIconGender(listMembers[0].gender)}
                        size={40}
                    />
                    <StyleText
                        i18Text="mess.detailSetting.profile"
                        customStyle={[
                            styles.textProfile,
                            {color: borderMessRoute},
                        ]}
                    />
                </FlyButton>

                {/* Button change color chat */}
                <ButtonChangeTheme
                    colorNow={itemChatTag.color}
                    onChangeChatTheme={onChangeChatTheme}
                />

                {/* Button stop or block chat */}
                {!isChatTagOfMe && (
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
                                    {color: theme.borderColor},
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
                )}
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
    },
    iconBackView: {
        position: 'absolute',
        zIndex: 2,
        left: '15@s',
    },
    listMemberBox: {
        width: '100%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imgAvatar: {
        width: '50@s',
        height: '50@s',
        borderRadius: '25@s',
        borderWidth: '2@s',
        marginHorizontal: '5@s',
    },
    // group name view
    groupNameView: {
        width: '100%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: '40@vs',
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
    // button view
    buttonProfile: {
        alignSelf: 'center',
        width: '70@s',
        height: '70@s',
    },
    iconProfile: {
        fontSize: '17@ms',
    },
    textProfile: {
        fontSize: '11@ms',
    },
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
