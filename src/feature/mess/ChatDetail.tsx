import {useIsFocused} from '@react-navigation/core';
import {TypeChatTagResponse} from 'api/interface';
import Images from 'asset/img/images';
import {StyleIcon, StyleImage} from 'components/base';
import StyleList from 'components/base/StyleList';
import {useSocketChatDetail} from 'hook/useSocket';
import Redux from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {MESS_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {logger} from 'utility/assistant';
import ItemMessage from './components/ItemMessage';
import UserInput from './components/UserInput';

interface ChatDetailProps {
    route: {
        params: {
            itemChatTag: TypeChatTagResponse;
        };
    };
}

const ChatDetail = ({route}: ChatDetailProps) => {
    const {itemChatTag} = route.params;
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();

    const isFocused = useIsFocused();

    const inputRef = useRef<FlatList>(null);

    const {messages, sendMessage} = useSocketChatDetail(itemChatTag.id);
    const data: any = messages;

    const [groupName, setGroupName] = useState(itemChatTag.groupName);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const myAvatar = useMemo(() => {
        for (let i = 0; i < itemChatTag.listUser.length; i++) {
            if (profile.id === itemChatTag.listUser[i].id) {
                return itemChatTag.listUser[i].avatar;
            }
        }
        return '';
    }, []);

    useEffect(() => {
        if (isFocused) {
            Redux.setChatTafFocusing(itemChatTag.id);
        }
    }, [isFocused]);

    const onSend = () => {
        if (profile?.id) {
            sendMessage({
                chatTag: itemChatTag.id,
                message: content,
                images: [],
                senderId: profile.id,
                senderAvatar: myAvatar,
                listUser: itemChatTag.listUser.map(item => item.id),
            });
            setContent('');
            setImages([]);
        }
        inputRef.current?.scrollToOffset({offset: 0});
    };

    const onRequestOpenPublic = async () => {
        if (itemChatTag.isPrivate) {
            logger('open public');
        }
    };

    const onNavigateToMessSetting = () => {
        navigate(MESS_ROUTE.chatDetailSetting, {
            itemChatTag,
            updateGroupName: setGroupName,
        });
    };

    // render_view
    const renderListMessage = ({item, index}: any) => {
        const isMyMessageBefore =
            index === 0
                ? true
                : messages?.[index - 1]?.relationship === item.relationship;
        return (
            <ItemMessage
                itemMessage={item}
                isMyMessageBefore={isMyMessageBefore}
            />
        );
    };

    const HeaderShh = useMemo(() => {
        if (!itemChatTag.isPrivate) {
            return (
                <AntDesign
                    name="team"
                    style={{
                        fontSize: moderateScale(17),
                        color: theme.textColor,
                    }}
                />
            );
        }
        return (
            <StyleIcon
                source={Images.icons.shh}
                size={30}
                customStyle={[
                    styles.iconShh,
                    {
                        tintColor: theme.textColor,
                    },
                ]}
            />
        );
    }, []);

    const HeaderOption = useMemo(() => {
        return (
            <AntDesign
                name="infocirlceo"
                style={[styles.iconCloud, {color: theme.textColor}]}
            />
        );
    }, []);

    // this is for send box cloud, will develop later
    // const HeaderBoxCloud = useMemo(() => {
    //     return (
    //         <Feather
    //             name="cloud-snow"
    //             style={[styles.iconCloud, {color: theme.textColor}]}
    //         />
    //     );
    // }, []);

    return (
        <KeyboardAwareView
            animated
            style={[
                styles.container,
                {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor,
                },
            ]}>
            <Header
                headerTitle={groupName}
                // headerRight1={HeaderBoxCloud}
                headerRight2={HeaderShh}
                headerRight2Mission={onRequestOpenPublic}
                headerRight3={HeaderOption}
                headerRight3Mission={onNavigateToMessSetting}
            />

            <View style={{flex: 1}}>
                <StyleList
                    ref={inputRef}
                    data={data}
                    renderItem={renderListMessage}
                    contentContainerStyle={styles.contentContainer}
                    inverted
                />
            </View>

            {!!images.length && (
                <View style={styles.twoImageInput}>
                    {images.map((item, index) => (
                        <StyleImage
                            key={index}
                            source={{uri: item}}
                            customStyle={styles.imageInput}
                            resizeMode="cover"
                        />
                    ))}
                </View>
            )}

            <UserInput
                text={content}
                setText={(text: string) => setContent(text)}
                onSendMessage={onSend}
                images={images}
                setImages={setImages}
            />
        </KeyboardAwareView>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius: '20@vs',
        borderBottomWidth: 0,
    },
    contentContainer: {
        flexGrow: 1,
    },
    contentPart: {
        flex: 1,
    },
    messageView: {
        width: '100%',
        marginTop: '5@vs',
    },
    messageBox: {
        paddingVertical: '10@vs',
        borderRadius: '10@vs',
        maxWidth: '70%',
    },
    messageText: {
        fontSize: '15@ms',
    },
    twoImageInput: {
        width: '100%',
        height: '75@vs',
        paddingTop: '15@vs',
        paddingHorizontal: '5@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageInput: {
        width: '47.5%',
        height: '100%',
        borderRadius: '5@vs',
    },
    iconShh: {},
    iconCloud: {
        fontSize: '17@ms',
    },
    footerView: {
        width: '100%',
        minHeight: '100@vs',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
});

export default memo(ChatDetail);
