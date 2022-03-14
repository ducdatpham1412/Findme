import {TypeBubblePalace} from 'api/interface';
import {apiLikePost, apiUnLikePost} from 'api/module';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {chooseColorGradient, choosePrivateAvatar} from 'utility/assistant';
import IconHobby from './IconHobby';

interface Props {
    item: TypeBubblePalace;
    onInteractBubble(idBubble: TypeBubblePalace): void;
}

const bubbleWidth =
    Metrics.width - Metrics.safeLeftPadding - Metrics.safeRightPadding;
const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const Bubble = ({item, onInteractBubble}: Props) => {
    const {gradient} = Redux.getResource();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);

    const onLikeUnLike = useCallback(async () => {
        const currentLike = isLiked;
        const currentNumberLikes = totalLikes;
        try {
            setIsLiked(!currentLike);
            setTotalLikes(currentNumberLikes + (currentLike ? -1 : 1));
            currentLike
                ? await apiUnLikePost(item.id)
                : await apiLikePost(item.id);
        } catch (err) {
            setIsLiked(currentLike);
            setTotalLikes(currentNumberLikes);
            appAlert(err);
        }
    }, [isLiked, totalLikes]);

    const onReportUser = useCallback(() => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser: item.creatorId,
        });
    }, []);

    /**
     * Render view
     */
    const RenderImage = useMemo(() => {
        return (
            <StyleImage
                source={{uri: item.images[0]}}
                customStyle={styles.image}
            />
        );
    }, []);

    const RenderAvatarNameAndContent = useMemo(() => {
        const avatar = choosePrivateAvatar(item.gender);
        return (
            <View style={styles.avatarNameContentView}>
                <View style={styles.avatarNameBox}>
                    <StyleImage
                        source={{uri: avatar}}
                        customStyle={styles.avatar}
                    />
                    <StyleText
                        originValue={`@${item.name}`}
                        customStyle={styles.textName}
                    />
                </View>
                <View style={styles.contentBox}>
                    <StyleMoreText
                        value={item.content}
                        textStyle={styles.textContent}
                    />
                </View>
            </View>
        );
    }, [item.gender, item.name, item.content]);

    const RenderIconHobby = useMemo(() => {
        return <IconHobby color={item.color} />;
    }, [item.color]);

    const RenderIconLikeUnLike = useMemo(() => {
        const color = isLiked ? Theme.common.pink : Theme.common.white;
        return (
            <>
                <View style={styles.likeBox}>
                    {isLiked ? (
                        <IconLiked
                            onPress={onLikeUnLike}
                            customStyle={styles.iconLike}
                        />
                    ) : (
                        <IconNotLiked
                            onPress={onLikeUnLike}
                            customStyle={styles.iconUnLike}
                        />
                    )}
                </View>

                <View style={styles.textLikeBox}>
                    <StyleText
                        originValue={totalLikes}
                        customStyle={[styles.textLike, {color}]}
                    />
                </View>
            </>
        );
    }, [isLiked, totalLikes]);

    const RenderStartChat = useMemo(() => {
        const color = chooseColorGradient({
            listGradients: gradient,
            colorChoose: item.color,
        });
        return (
            <LinearGradient
                style={styles.linearGradient}
                colors={color}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <StyleTouchable
                    customStyle={styles.touchStartChat}
                    onPress={() => onInteractBubble(item)}>
                    <StyleText
                        i18Text="discovery.bubble.startChat"
                        customStyle={[
                            styles.textStart,
                            {color: Theme.common.white},
                        ]}
                    />
                </StyleTouchable>
            </LinearGradient>
        );
    }, [item]);

    const RenderReport = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={styles.reportView}
                onPress={onReportUser}>
                <Feather
                    name="flag"
                    style={[styles.iconReport, {color: Theme.common.white}]}
                />
            </StyleTouchable>
        );
    }, []);

    return (
        <View style={styles.itemBubbleView}>
            {RenderImage}
            {RenderAvatarNameAndContent}
            {RenderReport}
            <View style={styles.toolView}>
                {RenderIconHobby}
                {RenderIconLikeUnLike}
            </View>
            {RenderStartChat}
        </View>
    );
};

const styles = ScaledSheet.create({
    itemBubbleView: {
        width: bubbleWidth,
        height: bubbleHeight,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    // tool
    toolView: {
        position: 'absolute',
        width: '100@s',
        paddingVertical: '10@vs',
        bottom: Metrics.height / 3,
        right: 0,
        alignItems: 'center',
    },
    likeBox: {
        width: '100%',
        height: '70@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLike: {
        fontSize: '60@ms',
    },
    iconUnLike: {
        fontSize: '60@ms',
    },
    textLikeBox: {
        height: '30@ms',
    },
    textLike: {
        fontSize: '20@ms',
    },
    // gradient
    linearGradient: {
        height: '40@s',
        position: 'absolute',
        alignSelf: 'center',
        bottom: '100@vs',
        borderRadius: '50@s',
    },
    touchStartChat: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '50@s',
    },
    textStart: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    // report
    reportView: {
        position: 'absolute',
        width: '50@ms',
        height: '50@ms',
        top: Metrics.safeTopPadding + verticalScale(5),
        right: '10@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30@ms',
    },
    iconReport: {
        fontSize: '25@ms',
    },
    reportBox: {
        position: 'absolute',
        right: '60@ms',
        top: '60@ms',
    },
    // avatar, name and content
    avatarNameContentView: {
        position: 'absolute',
        top: Metrics.safeTopPadding + verticalScale(10),
        left: '10@s',
        width: '70%',
    },
    avatarNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: '35@ms',
        height: '35@ms',
        marginRight: '10@ms',
    },
    textName: {
        fontSize: '20@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    contentBox: {
        width: '100%',
        paddingLeft: '45@ms',
        paddingTop: '7@vs',
    },
    textContent: {
        fontSize: '17@ms',
        color: Theme.common.white,
    },
});

export default memo(Bubble, (preProps: Props, nextProps: any) => {
    for (const [key, value] of Object.entries(preProps)) {
        if (nextProps?.[key] !== value) {
            return false;
        }
    }
    return true;
});
