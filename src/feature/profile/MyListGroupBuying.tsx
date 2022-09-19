import {TypeGroupBuying} from 'api/interface';
import {apiGetListGroupBuying} from 'api/post';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, ratioImageGroupBuying} from 'asset/standardValue';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import {SharedElement} from 'react-navigation-shared-element';

interface Props {
    userId: number;
    onTouchStart(): void;
    onTouchEnd(): void;
}

const {width} = Metrics;

const MyListGroupBuying = (props: Props) => {
    const {userId, onTouchStart, onTouchEnd} = props;
    const theme = Redux.getTheme();

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListGroupBuying,
        params: {
            userId,
        },
    });

    const goToDetailPost = (item: TypeGroupBuying) => {
        navigate(PROFILE_ROUTE.detailGroupBuying, {
            item,
            setList,
        });
    };

    const RenderItem = useCallback((item: TypeGroupBuying) => {
        const isBiggerThanTwo = item.prices.length > 2;
        const displayPrices = isBiggerThanTwo
            ? item.prices.slice(0, 2)
            : item.prices;

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
                </SharedElement>
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.textContent,
                        {color: theme.textHightLight},
                    ]}
                    numberOfLines={2}
                />
                <View style={styles.footerView}>
                    <StyleIcon
                        source={Images.icons.dollar}
                        size={17}
                        customStyle={styles.iconDollar}
                    />
                    <View style={{flex: 1}}>
                        {displayPrices.map(price => (
                            <View style={styles.priceBox} key={price.value}>
                                <StyleText
                                    originValue={price.number_people}
                                    customStyle={[
                                        styles.textPrice,
                                        {
                                            color: theme.textColor,
                                            fontWeight: 'bold',
                                            width: '20%',
                                        },
                                    ]}
                                />
                                <StyleText
                                    originValue="-"
                                    customStyle={[
                                        styles.textPrice,
                                        {color: theme.borderColor},
                                    ]}
                                />
                                <StyleText
                                    originValue={price.value}
                                    customStyle={[
                                        styles.textPrice,
                                        {
                                            color: theme.textColor,
                                            marginLeft: '10%',
                                        },
                                    ]}
                                />
                            </View>
                        ))}
                        <StyleText
                            originValue="..."
                            customStyle={[
                                styles.textMore,
                                {
                                    color: theme.textColor,
                                },
                            ]}
                        />
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
        borderRadius: '10@ms',
    },
    imagePreview: {
        width: width * 0.6,
        height: width * 0.6 * ratioImageGroupBuying,
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
    },
    textContent: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        marginTop: '5@vs',
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
        flexDirection: 'row',
        paddingTop: '5@vs',
    },
    iconDollar: {
        marginLeft: '5%',
        marginTop: '5@vs',
    },
});

export default MyListGroupBuying;
