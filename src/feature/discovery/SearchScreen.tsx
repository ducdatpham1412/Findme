import {apiGetListBubbleActive} from 'api/module';
import {POST_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, LIST_TOPICS} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import AppInput from 'components/base/AppInput';
import StyleList from 'components/base/StyleList';
import LoadingScreen from 'components/LoadingScreen';
import StyleTabView from 'components/StyleTabView';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BubbleGroupBuying from './components/BubbleGroupBuying';
import HeaderFilterPrice from './HeaderFilterPrice';
import HeaderFilterTopic from './HeaderFilterTopic';

interface Props {
    route: {
        params: {
            topic?: number;
            search?: string;
        };
    };
}

const SearchScreen = ({route}: Props) => {
    const topicRoute = useRef(route.params?.topic).current;
    const searchRoute = useRef(route.params?.search).current;
    const inputRef = useRef<TextInput>(null);
    const categoryRef = useRef<HeaderFilterTopic>(null);
    const priceRef = useRef<HeaderFilterPrice>(null);

    const theme = Redux.getTheme();
    const {listPrices} = Redux.getResource();

    const [price, setPrice] = useState(listPrices[0]);
    const [topics, setTopics] = useState(
        topicRoute !== undefined
            ? [topicRoute]
            : LIST_TOPICS.map(item => item.id),
    );
    const [search, setSearch] = useState(searchRoute || '');
    const [hadLoadMore, setHadLoadMore] = useState(
        !(topicRoute === undefined && searchRoute === undefined),
    );

    const {
        list,
        setList,
        setParams,
        onLoadMore,
        refreshing,
        onRefresh,
        loading,
    } = usePaging({
        request: apiGetListBubbleActive,
        params: {
            topics: `[${String(topics)}]`,
            search,
            postTypes: `[${String([POST_TYPE.groupBuying])}]`,
        },
        isInitNotRunRequest:
            topicRoute === undefined && searchRoute === undefined,
    });

    useEffect(() => {
        if (topicRoute === undefined && searchRoute === undefined) {
            inputRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        setParams(preValue => ({
            ...preValue,
            topics: `[${String(topics)}]`,
        }));
    }, [topics]);

    useEffect(() => {
        setParams(preValue => ({
            ...preValue,
            prices: price.value ? `[${String(price.value)}]` : undefined,
        }));
    }, [price]);

    /**
     * Render view
     */
    const Header = () => {
        return (
            <View
                style={[
                    styles.searchView,
                    {borderBottomColor: theme.holderColorLighter},
                ]}>
                <StyleTouchable customStyle={styles.backView} onPress={goBack}>
                    <Ionicons
                        name="arrow-back"
                        style={[styles.iconBack, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
                <AppInput
                    ref={inputRef}
                    style={[styles.input]}
                    placeholder="Aa"
                    onChangeText={text => setSearch(text)}
                    defaultValue={searchRoute}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                        if (!hadLoadMore) {
                            setHadLoadMore(true);
                            onLoadMore();
                        }
                        setParams(preValue => ({
                            ...preValue,
                            search,
                        }));
                    }}
                />
                <StyleTouchable
                    onPress={() => {
                        inputRef.current?.clear();
                        setSearch('');
                    }}
                    customStyle={styles.clearView}>
                    <Feather
                        name="x"
                        style={[styles.iconClear, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    const Tool = () => {
        return (
            <View style={styles.toolView}>
                <StyleTouchable
                    customStyle={[
                        styles.toolBox,
                        {borderColor: theme.borderColor},
                    ]}
                    onPress={() => {
                        inputRef.current?.blur();
                        priceRef.current?.show();
                    }}>
                    <StyleIcon source={Images.icons.dollar} size={11} />
                    <StyleText
                        i18Text="profile.price"
                        customStyle={[
                            styles.textTool,
                            {color: theme.borderColor},
                        ]}>
                        {!!price.value && (
                            <StyleText
                                originValue={` (${1})`}
                                customStyle={[
                                    styles.textTool,
                                    {color: theme.borderColor},
                                ]}
                            />
                        )}
                    </StyleText>
                    <AntDesign
                        name="down"
                        style={[styles.iconDown, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
                <StyleTouchable
                    customStyle={[
                        styles.toolBox,
                        {marginLeft: 15, borderColor: theme.borderColor},
                    ]}
                    onPress={() => {
                        inputRef.current?.blur();
                        categoryRef.current?.show();
                    }}>
                    <StyleIcon
                        source={Images.icons.category}
                        size={11}
                        customStyle={{tintColor: Theme.common.gradientTabBar1}}
                    />
                    <StyleText
                        i18Text="discovery.category"
                        i18Params={{
                            value: topics.length,
                        }}
                        customStyle={[
                            styles.textTool,
                            {color: theme.borderColor},
                        ]}
                    />
                    <AntDesign
                        name="down"
                        style={[styles.iconDown, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {Header()}
            {Tool()}

            <StyleTabView containerStyle={styles.tabViewContainer}>
                <View style={styles.elementView}>
                    <StyleList
                        data={list}
                        renderItem={({item}) => {
                            return (
                                <BubbleGroupBuying
                                    item={item}
                                    onGoToDetailGroupBuying={() => {
                                        navigate(
                                            DISCOVERY_ROUTE.detailGroupBuying,
                                            {
                                                item,
                                                setList,
                                            },
                                        );
                                    }}
                                    detailGroupTarget={
                                        DISCOVERY_ROUTE.detailGroupBuying
                                    }
                                    onShowMoreOption={() => null}
                                    onHandleLike={() => null}
                                    onShowModalComment={() => {
                                        if (inputRef.current?.isFocused()) {
                                            inputRef.current.blur();
                                        }
                                        showCommentDiscovery({
                                            post: item,
                                            type: 'comment',
                                            setList,
                                        });
                                    }}
                                    onChangePostIdFocusing={() => null}
                                    containerStyle={styles.itemView}
                                />
                            );
                        }}
                        keyExtractor={item => item.id}
                        keyboardDismissMode="on-drag"
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        onLoadMore={onLoadMore}
                    />

                    {loading && <LoadingScreen />}
                </View>
            </StyleTabView>

            <HeaderFilterTopic
                ref={categoryRef}
                listTopics={topics}
                theme={theme}
                onChangeTopic={value => setTopics(value)}
            />
            <HeaderFilterPrice
                ref={priceRef}
                price={price}
                listPrices={listPrices}
                onChangePrice={value => {
                    const temp = listPrices.find(item => item.id === value.id);
                    if (temp) {
                        setPrice(temp);
                    }
                }}
                theme={theme}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    backView: {
        paddingHorizontal: '10@s',
    },
    searchView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '5@vs',
        paddingBottom: '5@vs',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    iconBack: {
        fontSize: '18@ms',
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
    },
    clearView: {
        paddingHorizontal: '10@s',
    },
    iconClear: {
        fontSize: '15@ms',
    },
    tabViewContainer: {
        height: '100%',
    },
    elementView: {
        width: Metrics.width,
        height: '100%',
    },
    // tool
    toolView: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '10@s',
        paddingVertical: '7@vs',
        alignItems: 'center',
    },
    toolBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '2@vs',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingHorizontal: '8@s',
        borderRadius: '20@ms',
    },
    textTool: {
        fontSize: FONT_SIZE.small,
        marginLeft: '7@s',
    },
    iconDown: {
        fontSize: '10@ms',
        marginLeft: '7@s',
    },
    itemView: {
        marginBottom: '20@vs',
        marginTop: 0,
    },
});

export default SearchScreen;
