import {TypeChatTagResponse} from 'api/interface';
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
import HeaderLeft from 'navigation/components/HeaderLeftIconSmall';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import {
    logger,
    moveMeToEndOfListMember,
    renderIconGender,
} from 'utility/assistant';

interface Props {
    route: {
        params: {
            itemChatTag: TypeChatTagResponse;
            updateGroupName: any;
        };
    };
}

const ChatDetailSetting = ({route}: Props) => {
    const updateGroupName = route.params.updateGroupName;
    const [itemChatTag, setItemChatTag] = useState(route.params.itemChatTag);
    const theme = Redux.getTheme();
    const {id} = Redux.getPassport().profile;
    // const {setDisableTabBar} = useTabBar();

    const listMembers = moveMeToEndOfListMember(itemChatTag.listUser);

    const inputGroupNameRef = useRef<TextInput>(null);

    const [groupName, setGroupName] = useState(itemChatTag.groupName);
    const canChangeName = groupName !== itemChatTag.groupName;

    /**
     * Edit group name
     */
    const agreeChangeName = () => {
        try {
            const newChatTag = {
                ...itemChatTag,
                groupName,
            };
            updateGroupName(groupName);
            Redux.updateAnIndexInListChatTag(newChatTag);
            setItemChatTag(newChatTag);
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

    // go to partner profile
    const onGoToProfile = () => {
        // setDisableTabBar(false);
        navigate(DISCOVERY_ROUTE.otherDisProfile, {
            id: listMembers[0].id,
        });
    };

    const onStopConversation = () => {
        logger('stop conversation');
    };

    return (
        <StyleContainer
            containerStyle={[
                styles.container,
                {borderColor: theme.borderColor},
            ]}>
            <StyleTouchable customStyle={styles.iconBackView} onPress={goBack}>
                <HeaderLeft />
            </StyleTouchable>

            {/* List member */}
            <View style={styles.listMemberView}>
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
            </View>

            {/* Group name */}
            <View style={styles.groupNameView}>
                <StyleInput
                    ref={inputGroupNameRef}
                    value={groupName}
                    onChangeText={text => setGroupName(text)}
                    containerStyle={[
                        styles.containerInputView,
                        {borderColor: theme.borderColor},
                    ]}
                    inputStyle={styles.inputBox}
                    hasErrorBox={false}
                    textAlign="center"
                />
                <StyleTouchable onPress={onPressIconEditName}>
                    {canChangeName ? (
                        <AntDesign
                            name="check"
                            style={[
                                styles.iconEdit,
                                {color: theme.borderColor},
                            ]}
                        />
                    ) : (
                        <AntDesign
                            name="edit"
                            style={[
                                styles.iconEdit,
                                {color: theme.borderColor},
                            ]}
                        />
                    )}
                </StyleTouchable>
            </View>

            {/* Button profile
                check icon follow gender of my partner */}
            <FlyButton
                containerStyle={styles.buttonProfile}
                disable={itemChatTag.isPrivate}
                onPress={onGoToProfile}>
                <StyleIcon
                    source={renderIconGender(listMembers[0].gender)}
                    size={40}
                />
                <StyleText
                    i18Text="mess.detailSetting.profile"
                    customStyle={[styles.textProfile, {color: theme.textColor}]}
                />
            </FlyButton>

            {/* Button stop conversation - only for private */}
            <View style={styles.twoButtonView}>
                {itemChatTag.isPrivate && (
                    <FlyButton
                        containerStyle={styles.buttonStop}
                        onPress={onStopConversation}>
                        <Octicons
                            name="stop"
                            style={[styles.stopIcon, {color: theme.textColor}]}
                        />
                        <StyleText
                            originValue="stop chat"
                            customStyle={[
                                styles.stopText,
                                {color: theme.textColor},
                            ]}
                        />
                    </FlyButton>
                )}

                <FlyButton
                    containerStyle={styles.buttonStop}
                    onPress={onStopConversation}>
                    <Entypo
                        name="block"
                        style={[styles.stopIcon, {color: theme.textColor}]}
                    />
                    <StyleText
                        originValue="block user"
                        customStyle={[
                            styles.stopText,
                            {color: theme.textColor},
                        ]}
                    />
                </FlyButton>
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius: '20@vs',
        borderBottomWidth: 0,
    },
    iconBackView: {
        position: 'absolute',
        top: '15@s',
        left: '10@s',
        zIndex: 2,
    },
    // list member view
    listMemberView: {
        width: '100%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imgAvatar: {
        width: '50@s',
        height: '50@s',
        borderRadius: '25@s',
        borderWidth: 1,
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
        fontSize: '18@ms',
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
        width: '60@s',
        height: '60@s',
    },
    stopIcon: {
        fontSize: '17@ms',
    },
    stopText: {
        fontSize: '8@ms',
        marginTop: '8@vs',
    },
    twoButtonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '50@vs',
    },
});

export default ChatDetailSetting;
