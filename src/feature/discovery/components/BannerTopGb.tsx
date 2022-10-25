import {apiGetTopGroupBuying} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, LIST_TOPICS} from 'asset/standardValue';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import StyleList from 'components/base/StyleList';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import ItemHotLocation from 'feature/common/components/ItemHotLocation';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {memo, useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width} = Metrics;
const itemWidth = width * 0.43;
export const spaceHeight = width * 0.45;

const Categories = memo(() => {
    const theme = Redux.getTheme();

    return (
        <>
            <StyleText
                i18Text="discovery.whereShouldWeGo"
                customStyle={[
                    styles.titleGroupBooking,
                    {color: theme.borderColor},
                ]}
            />
            <View style={styles.categoriesView}>
                {LIST_TOPICS.map((item, index) => {
                    const isUnder = index >= 4;
                    return (
                        <View
                            key={item.id}
                            style={[
                                styles.categoryBox,
                                {marginTop: isUnder ? verticalScale(20) : 0},
                            ]}>
                            <StyleTouchable
                                customStyle={{alignItems: 'center'}}
                                onPress={() =>
                                    navigate(DISCOVERY_ROUTE.searchScreen, {
                                        topic: item.id,
                                    })
                                }>
                                <StyleIcon
                                    source={item.icon}
                                    size={width * 0.11}
                                />
                                <StyleText
                                    i18Text={item.text}
                                    customStyle={[
                                        styles.textCategory,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    );
                })}
            </View>
        </>
    );
});

const BannerTopGb = () => {
    const theme = Redux.getTheme();
    const {banners, hotLocations} = Redux.getResource();

    const [list, setList] = useState<Array<TypeGroupBuying>>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiGetTopGroupBuying();
                setList(res.data);
            } catch (err) {
                appAlert(err);
            }
        };
        getData();
    }, []);

    const SearchBar = () => {
        return (
            <StyleTouchable
                customStyle={[
                    styles.searchView,
                    {backgroundColor: theme.backgroundTextInput},
                ]}
                onPress={() => navigate(DISCOVERY_ROUTE.searchScreen)}>
                <AntDesign
                    name="search1"
                    style={[styles.iconSearch, {color: theme.borderColor}]}
                />
                <StyleText
                    i18Text="discovery.searchAround"
                    customStyle={[
                        styles.textSearch,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>
        );
    };

    const Banner = () => {
        return (
            <View style={styles.bannerView}>
                <StyleList
                    horizontal
                    data={banners}
                    renderItem={({item}) => {
                        return (
                            <StyleImage
                                source={{uri: item}}
                                customStyle={styles.image}
                            />
                        );
                    }}
                    showsHorizontalScrollIndicator={false}
                    directionalLockEnabled
                />
            </View>
        );
    };

    const TopGroupBooking = () => {
        return (
            <>
                <StyleText
                    i18Text="discovery.topGroupBooking"
                    customStyle={[
                        styles.titleGroupBooking,
                        {color: theme.borderColor},
                    ]}
                />
                <StyleList
                    data={list}
                    renderItem={({item}) => (
                        <ItemGroupBuying
                            item={item}
                            setList={setList}
                            containerStyle={styles.itemView}
                            detailGroupTarget={
                                DISCOVERY_ROUTE.detailGroupBuying
                            }
                            syncWidth={itemWidth}
                            isHorizontal={false}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    directionalLockEnabled
                    keyExtractor={item => item.id}
                />
            </>
        );
    };

    const TopLocation = () => {
        return (
            <>
                <StyleText
                    i18Text="discovery.hotLocation"
                    customStyle={[
                        styles.titleGroupBooking,
                        {color: theme.borderColor},
                    ]}
                />
                <StyleList
                    data={hotLocations}
                    renderItem={({item}) => (
                        <ItemHotLocation
                            item={item}
                            syncWidth={itemWidth}
                            containerStyle={styles.itemView}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    directionalLockEnabled
                    keyExtractor={item => item.location}
                />
            </>
        );
    };

    return (
        <View style={styles.container}>
            {SearchBar()}
            {Banner()}
            <Categories />
            {TopGroupBooking()}
            {TopLocation()}

            <StyleText
                i18Text="discovery.discovery"
                customStyle={[
                    styles.titleDiscovery,
                    {color: theme.borderColor},
                ]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
    },
    titleGroupBooking: {
        fontSize: FONT_SIZE.big,
        // fontWeight: 'bold',
        left: '10@s',
        marginTop: '20@vs',
        marginBottom: '10@vs',
    },
    titleDiscovery: {
        fontSize: FONT_SIZE.big,
        left: '10@s',
        marginTop: '20@vs',
    },
    itemView: {
        marginLeft: width * 0.03,
        marginRight: '5@s',
        marginTop: 0,
        marginBottom: 0,
    },
    searchView: {
        paddingVertical: '7@vs',
        paddingHorizontal: '20@s',
        borderRadius: '15@ms',
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%',
        alignSelf: 'center',
        marginTop: '5@vs',
    },
    iconSearch: {
        fontSize: '15@ms',
    },
    textSearch: {
        fontSize: FONT_SIZE.small,
        marginLeft: '3@s',
    },
    // banner
    bannerView: {
        width: '100%',
        height: spaceHeight,
        marginTop: '10@vs',
    },
    image: {
        width: width * 0.85,
        height: spaceHeight,
        marginLeft: width * 0.03,
        marginRight: '5@s',
        borderRadius: '15@ms',
    },
    // categories
    categoriesView: {
        width,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryBox: {
        width: width / 4,
        alignItems: 'center',
    },
    textCategory: {
        fontSize: FONT_SIZE.tiny,
        marginTop: '5@vs',
    },
});

export default BannerTopGb;
