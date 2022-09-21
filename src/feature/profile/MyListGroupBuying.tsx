import {TypeGroupBuying} from 'api/interface';
import {apiGetListGroupBuying} from 'api/post';
import {GROUP_BUYING_STATUS, RELATIONSHIP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, ratioImageGroupBuying} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {navigate, push} from 'navigation/NavigationService';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import {SharedElement} from 'react-navigation-shared-element';
import {formatDayGroupBuying, formatLocaleNumber} from 'utility/format';
import Entypo from 'react-native-vector-icons/Entypo';

interface Props {
    userId: number;
    onTouchStart(): void;
    onTouchEnd(): void;
    detailGroupBuyingName: string;
}

const {width} = Metrics;

const MyListGroupBuying = (props: Props) => {
    const {userId, onTouchStart, onTouchEnd, detailGroupBuyingName} = props;
    const theme = Redux.getTheme();

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListGroupBuying,
        params: {
            userId,
        },
    });

    const goToDetailPost = (item: TypeGroupBuying) => {
        push(detailGroupBuyingName, {
            item,
            setList,
        });
    };

    /**
     * Render views
     */
    const ButtonCheckJoined = useCallback(
        (item: TypeGroupBuying) => {
            if (item.relationship === RELATIONSHIP.self) {
                return (
                    <LinearGradient
                        style={styles.boughtBox}
                        colors={[
                            Theme.common.commentGreen,
                            Theme.common.gradientTabBar2,
                        ]}>
                        <Entypo name="check" style={styles.iconBought} />
                    </LinearGradient>
                );
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
                const isJoined =
                    item.status === GROUP_BUYING_STATUS.joinedNotBought;
                return (
                    <StyleTouchable
                        customStyle={[
                            styles.joinGroupBuyingBox,
                            {
                                backgroundColor: isJoined
                                    ? theme.highlightColor
                                    : theme.backgroundButtonColor,
                            },
                        ]}
                        onPress={() =>
                            navigate(detailGroupBuyingName, {
                                item,
                                setList,
                            })
                        }>
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
                                    fontWeight: isJoined ? 'bold' : 'normal',
                                },
                            ]}
                        />
                    </StyleTouchable>
                );
            }

            return null;
        },
        [theme.holderColor],
    );

    const RenderItem = useCallback((item: TypeGroupBuying) => {
        const displayPrices = item.prices[item.prices.length - 1];

        return (
            <StyleTouchable
                customStyle={[
                    styles.itemView,
                    {backgroundColor: theme.backgroundColor},
                ]}
                onPress={() => goToDetailPost(item)}>
                <SharedElement
                    style={styles.imagePreview}
                    id={`item.group_buying.${item.id}`}>
                    <StyleImage
                        source={{uri: item.images[0]}}
                        customStyle={styles.imagePreview}
                    />
                    <View style={styles.numberPeopleBox}>
                        <StyleIcon
                            source={Images.icons.createGroup}
                            size={15}
                            customStyle={styles.iconGroup}
                        />
                        <StyleText
                            originValue={item.totalJoins}
                            customStyle={styles.textNumberPeople}
                        />
                    </View>
                </SharedElement>
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.textContent,
                        {color: theme.textHightLight},
                    ]}
                    numberOfLines={1}
                />
                <View style={styles.footerView}>
                    <View style={styles.infoBox}>
                        <StyleIcon source={Images.icons.calendar} size={13} />
                        <StyleText
                            originValue={formatDayGroupBuying(item.endDate)}
                            customStyle={[
                                styles.textEndDate,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                    <View style={styles.infoBox}>
                        <StyleIcon source={Images.icons.dollar} size={13} />
                        <StyleText
                            originValue={`${
                                displayPrices.number_people
                            } - ${formatLocaleNumber(displayPrices.value)}vnd`}
                            customStyle={[
                                styles.textEndDate,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                    <View
                        style={[styles.infoBox, {justifyContent: 'flex-end'}]}>
                        {ButtonCheckJoined(item)}
                    </View>
                </View>
            </StyleTouchable>
        );
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={styles.body}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}>
                <Carousel
                    horizontal
                    data={list}
                    renderItem={({item}) => RenderItem(item)}
                    sliderWidth={width * 0.9}
                    itemWidth={width * 0.6}
                    slideStyle={styles.slide}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onEndReached={onLoadMore}
                />
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: (width * 2) / 3.5,
        alignItems: 'center',
        marginTop: '10@vs',
        overflow: 'hidden',
    },
    body: {
        width: width * 0.9,
        height: '100%',
    },
    slide: {
        alignItems: 'center',
    },
    itemView: {
        width: '100%',
        height: '100%',
        borderRadius: '8@ms',
    },
    imagePreview: {
        width: width * 0.6,
        height: width * 0.6 * ratioImageGroupBuying,
        borderTopLeftRadius: '8@ms',
        borderTopRightRadius: '8@ms',
    },
    numberPeopleBox: {
        position: 'absolute',
        left: '3@s',
        bottom: '3@s',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.darkTheme.backgroundOpacity(0.6),
        paddingHorizontal: '8@s',
        paddingVertical: '3@vs',
        borderRadius: '20@ms',
    },
    iconGroup: {
        tintColor: Theme.common.white,
    },
    textNumberPeople: {
        marginLeft: '3@s',
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    textContent: {
        fontSize: FONT_SIZE.small,
        marginVertical: '5@vs',
        width: '90%',
        alignSelf: 'center',
    },
    priceBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5@vs',
        paddingLeft: '8@s',
    },
    textPrice: {
        fontSize: FONT_SIZE.small,
    },
    textMore: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        marginLeft: '5%',
        marginTop: '5@vs',
    },
    footerView: {
        flex: 1,
        paddingBottom: '2@vs',
    },
    infoBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5@s',
    },
    textEndDate: {
        marginLeft: '5@s',
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
    boughtBox: {
        paddingHorizontal: '10@s',
        paddingVertical: '3@vs',
        borderRadius: '20@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBought: {
        fontSize: '10@ms',
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
        paddingVertical: '3@vs',
        borderRadius: '5@ms',
    },
    textTellJoin: {
        fontSize: FONT_SIZE.small,
    },
});

export default MyListGroupBuying;
