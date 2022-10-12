import {BlurView} from '@react-native-community/blur';
import {TypeGroupBuying} from 'api/interface';
import {GROUP_BUYING_STATUS, RELATIONSHIP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, ratioImageGroupBuying} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import {SharedElement} from 'react-navigation-shared-element';
import {onGoToProfile} from 'utility/assistant';
import {formatDayGroupBuying, formatLocaleNumber} from 'utility/format';

interface Props {
    item: TypeGroupBuying;
    setList?: any;
    containerStyle?: StyleProp<ViewStyle>;
    detailGroupTarget: string;
    syncWidth?: number;
    isHorizontal: boolean;
}

const {width} = Metrics;

const CustomBlurView = () => {
    return (
        <BlurView
            style={styles.blurView}
            blurType="ultraThinMaterialLight"
            blurAmount={0}
            blurRadius={1}
            reducedTransparencyFallbackColor="white"
        />
    );
};

const ButtonCheckJoined = (item: TypeGroupBuying, theme: TypeTheme) => {
    if (item.relationship === RELATIONSHIP.self) {
        return null;
    }
    if (item.status === GROUP_BUYING_STATUS.bought) {
        return (
            <LinearGradient
                style={styles.boughtBox}
                colors={[
                    Theme.common.commentGreen,
                    Theme.common.gradientTabBar2,
                ]}>
                <Entypo name="check" style={styles.iconBought} />
                <StyleText
                    i18Text="discovery.bought"
                    customStyle={styles.textBought}
                />
            </LinearGradient>
        );
    }
    if (
        [
            GROUP_BUYING_STATUS.notJoined,
            GROUP_BUYING_STATUS.joinedNotBought,
        ].includes(item.status)
    ) {
        const isJoined = item.status === GROUP_BUYING_STATUS.joinedNotBought;
        return (
            <View
                style={[
                    styles.joinGroupBuyingBox,
                    {
                        backgroundColor: isJoined
                            ? theme.highlightColor
                            : theme.backgroundButtonColor,
                    },
                ]}>
                <StyleText
                    i18Text={
                        isJoined
                            ? 'discovery.joined'
                            : 'discovery.joinGroupBuying'
                    }
                    customStyle={[
                        styles.textTellJoin,
                        {
                            color: isJoined
                                ? theme.backgroundColor
                                : theme.textHightLight,
                        },
                    ]}
                />
            </View>
        );
    }

    return null;
};

const ItemGroupBuying = (props: Props) => {
    const {
        item,
        setList,
        containerStyle,
        detailGroupTarget,
        syncWidth = width * 0.8,
        isHorizontal,
    } = props;
    const theme = Redux.getTheme();

    const lastPrice = item.prices[item.prices.length - 1];
    const iconSize = (syncWidth / width) * 15;

    const LocationAndPeopleJoined = () => {
        if (isHorizontal) {
            return null;
        }
        return (
            <>
                <View style={styles.locationVerticalBox}>
                    <Entypo
                        name="location-pin"
                        style={styles.iconLocationVertical}
                    />
                    <StyleText
                        originValue={item.creatorLocation}
                        customStyle={[
                            styles.textInfo,
                            {color: theme.textHightLight},
                        ]}
                        numberOfLines={1}
                    />
                </View>
            </>
        );
    };

    return (
        <StyleTouchable
            key={item.id}
            style={[
                styles.itemView,
                {
                    backgroundColor: theme.backgroundColor,
                    shadowColor: theme.borderColor,
                },
                containerStyle,
                {
                    width: syncWidth,
                },
            ]}
            onPress={() =>
                navigate(detailGroupTarget, {
                    item,
                    setList,
                })
            }>
            {/* Image preview */}
            <SharedElement
                style={[
                    styles.imagePreview,
                    {
                        height: syncWidth * ratioImageGroupBuying,
                    },
                ]}
                id={`item.group_buying.${item.id}`}>
                <StyleImage
                    source={{uri: item.images[0]}}
                    customStyle={[
                        styles.imagePreview,
                        {
                            height: syncWidth * ratioImageGroupBuying,
                        },
                    ]}
                />

                <StyleTouchable
                    customStyle={styles.creatorView}
                    onPress={() => onGoToProfile(item.creator)}>
                    <CustomBlurView />
                    <StyleIcon
                        source={{uri: item.creatorAvatar}}
                        size={20}
                        customStyle={styles.avatar}
                    />
                    <StyleText
                        originValue={item.creatorName}
                        numberOfLines={1}
                        customStyle={styles.textName}
                    />
                </StyleTouchable>

                <View style={styles.bottomView}>
                    <View style={styles.numberJoinedBox}>
                        <CustomBlurView />
                        <StyleIcon
                            source={Images.icons.createGroup}
                            size={15}
                            customStyle={styles.iconNumberPeople}
                        />
                        <StyleText
                            originValue={item.totalJoins}
                            customStyle={styles.textNumberPeople}
                        />
                    </View>

                    {!!item.creatorLocation && isHorizontal && (
                        <View style={styles.locationBox}>
                            <CustomBlurView />
                            <Entypo
                                name="location-pin"
                                style={styles.iconLocation}
                            />
                            <StyleText
                                originValue={item.creatorLocation}
                                customStyle={styles.textLocation}
                                numberOfLines={1}
                            />
                        </View>
                    )}
                </View>
            </SharedElement>

            {/* Content */}
            {!!item.content && isHorizontal && (
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.textContent,
                        {color: theme.textHightLight},
                    ]}
                    numberOfLines={1}
                />
            )}

            {LocationAndPeopleJoined()}

            <View style={styles.contentView}>
                <View style={{flex: 1}}>
                    <View style={styles.infoView}>
                        <StyleIcon
                            source={Images.icons.deadline}
                            size={iconSize}
                        />
                        <StyleText
                            originValue={formatDayGroupBuying(
                                item.deadlineDate,
                            )}
                            customStyle={[
                                styles.textInfo,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                    <View style={styles.infoView}>
                        <StyleIcon
                            source={Images.icons.dollar}
                            size={iconSize}
                        />
                        <StyleText
                            originValue={`${lastPrice.number_people}`}
                            customStyle={[
                                styles.textInfo,
                                {color: theme.borderColor},
                            ]}
                        />
                        <StyleText
                            originValue=" - "
                            customStyle={[
                                styles.textInfo,
                                {color: theme.borderColor},
                            ]}
                        />
                        <StyleText
                            originValue={`${formatLocaleNumber(
                                lastPrice.value,
                            )}vnd`}
                            customStyle={[
                                styles.textInfo,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                </View>
                {isHorizontal && ButtonCheckJoined(item, theme)}
            </View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    itemView: {
        marginVertical: '10@vs',
        borderRadius: '15@ms',
        shadowOpacity: 0.3,
        shadowOffset: {
            height: moderateScale(1),
            width: 0,
        },
    },
    imagePreview: {
        width: '100%',
        borderTopLeftRadius: '15@ms',
        borderTopRightRadius: '15@ms',
    },
    creatorView: {
        position: 'absolute',
        left: '7@s',
        top: '7@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: '10@ms',
    },
    avatar: {
        borderRadius: '30@ms',
        marginLeft: '5@s',
        marginVertical: '2@s',
    },
    textName: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '5@s',
    },
    textCreated: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.grayLight,
    },
    bottomView: {
        position: 'absolute',
        bottom: '7@s',
        paddingHorizontal: '7@s',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    numberJoinedBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconNumberPeople: {
        tintColor: Theme.common.white,
        marginLeft: '5@s',
        marginVertical: '2@s',
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '5@s',
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10@s',
        maxWidth: '80%',
        overflow: 'hidden',
    },
    iconLocation: {
        fontSize: '13@ms',
        marginLeft: '5@s',
        marginVertical: '2@s',
        color: Theme.common.white,
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.white,
        marginLeft: '3@s',
        maxWidth: '80%',
    },
    // content
    contentView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContent: {
        fontSize: FONT_SIZE.small,
        marginHorizontal: '10@s',
        marginVertical: '5@vs',
    },
    infoView: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '10@s',
        marginVertical: '5@vs',
        alignItems: 'center',
    },
    textInfo: {
        fontSize: FONT_SIZE.small,
        marginLeft: '8@s',
    },
    boughtBox: {
        marginRight: '10@s',
        padding: '5@ms',
        borderRadius: '20@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBought: {
        fontSize: '15@ms',
        color: Theme.common.white,
    },
    textBought: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '3@s',
    },
    joinGroupBuyingBox: {
        marginRight: '5@s',
        paddingHorizontal: '10@s',
        paddingVertical: '5@vs',
        borderRadius: '20@ms',
    },
    textTellJoin: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
    locationVerticalBox: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        paddingLeft: '7@s',
        paddingRight: '20@s',
        marginVertical: '5@vs',
    },
    iconLocationVertical: {
        fontSize: '13@ms',
        color: Theme.common.commentGreen,
    },
    peopleJoinedBox: {
        flexDirection: 'row',
        marginTop: '5@vs',
        paddingHorizontal: '10@s',
    },
});

export default ItemGroupBuying;
