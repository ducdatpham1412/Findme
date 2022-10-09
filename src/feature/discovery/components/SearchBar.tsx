import {TypeResultSearch} from 'api/interface/discovery';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import React, {Component, useEffect, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {
    Animated,
    Platform,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {I18Normalize} from 'utility/I18Next';
import {spaceHeight} from './ListTopGroupBuying';

interface Props {
    theme: TypeTheme;
    onSearch(value: string): void;
    onChangeShowTopGroupBooking(value: boolean): void;
    resultSearch: TypeResultSearch;
    topics: Array<number>;
}

interface States {
    textSearch: string;
    textDisplayResult: string;
}

interface InputProps extends TextInputProps {
    i18PlaceHolder: I18Normalize;
}

interface BannerProps {
    animateBanner: boolean;
    resultSearch: TypeResultSearch;
    textSearch: string;
}

const CustomInput = (props: InputProps) => {
    const {t} = useTranslation();
    return (
        <TextInput
            {...props}
            placeholder={props.i18PlaceHolder ? t(props.i18PlaceHolder) : ''}
        />
    );
};

const BannerBox = ({animateBanner, resultSearch, textSearch}: BannerProps) => {
    const timeOutCheck = useRef<any>(null);
    const opacityBanner1 = useRef(new Animated.Value(1)).current;
    const opacityBanner2 = useRef(new Animated.Value(0)).current;
    const [tabFocus, setTabFocus] = useState(0);

    useEffect(() => {
        if (!animateBanner || resultSearch) {
            opacityBanner1.setValue(1);
            opacityBanner2.setValue(0);
            clearInterval(timeOutCheck.current);
        } else {
            timeOutCheck.current = setInterval(() => {
                setTabFocus(preValue => {
                    return preValue === 0 ? 1 : 0;
                });
            }, 6000);
        }
    }, [animateBanner, resultSearch]);

    useEffect(() => {
        if (tabFocus === 0) {
            Animated.parallel([
                Animated.timing(opacityBanner1, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityBanner2, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else if (tabFocus === 1) {
            Animated.parallel([
                Animated.timing(opacityBanner1, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityBanner2, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [tabFocus]);

    return (
        <View style={styles.upperBox}>
            {resultSearch ? (
                <>
                    <StyleText
                        i18Text="discovery.resultFor"
                        customStyle={styles.textTitleSearch}>
                        <StyleText
                            originValue={` '${textSearch}'`}
                            customStyle={[
                                styles.textTitleSearch,
                                {color: Theme.common.white, fontWeight: 'bold'},
                            ]}
                        />
                    </StyleText>
                    <View style={styles.itemResultBox}>
                        <StyleIcon source={Images.icons.star} size={15} />
                        <StyleText
                            i18Text="discovery.averageStars"
                            i18Params={{
                                value: resultSearch.average_stars,
                            }}
                            customStyle={styles.textSearch}
                        />
                    </View>
                    <View style={styles.itemResultBox}>
                        <StyleIcon source={Images.icons.chatNow} size={15} />
                        <StyleText
                            i18Text="discovery.totalReviews"
                            i18Params={{
                                value: resultSearch.total_reviews,
                            }}
                            customStyle={styles.textSearch}
                        />
                    </View>
                    <View style={styles.itemResultBox}>
                        <StyleIcon source={Images.icons.house} size={15} />
                        <StyleText
                            i18Text="discovery.totalCampaigns"
                            i18Params={{
                                value: resultSearch.total_group_bookings,
                            }}
                            customStyle={styles.textSearch}
                        />
                    </View>
                </>
            ) : (
                <>
                    <Animated.View
                        style={[styles.bannerTouch, {opacity: opacityBanner1}]}>
                        <StyleText
                            i18Text="discovery.bookTourWithOther"
                            customStyle={styles.titleBanner}
                        />
                        <StyleText
                            i18Text="discovery.travelWithReasonablePrice"
                            customStyle={styles.textBanner}
                        />
                    </Animated.View>

                    <Animated.View
                        style={[styles.bannerTouch, {opacity: opacityBanner2}]}>
                        <StyleText
                            i18Text="discovery.travelReview"
                            customStyle={styles.titleBanner}
                        />
                        <StyleText
                            i18Text="discovery.letCreateCommunity"
                            customStyle={styles.textBanner}
                        />
                    </Animated.View>
                </>
            )}
        </View>
    );
};

class SearchBar extends Component<Props, States> {
    opacity = new Animated.Value(1);

    translateY = new Animated.Value(0);

    state: States = {
        textSearch: '',
        textDisplayResult: '',
    };

    setOpacity(value: number) {
        this.opacity.setValue(value);
    }

    setTranslateY(value: number) {
        this.translateY.setValue(value);
    }

    shouldComponentUpdate(nextProps: Readonly<Props>) {
        if (!isEqual(nextProps.resultSearch, this.props.resultSearch)) {
            return true;
        }
        if (!isEqual(nextProps.topics, this.props.topics)) {
            return true;
        }
        if (
            nextProps.theme.backgroundColor !== this.props.theme.backgroundColor
        ) {
            return true;
        }
        return false;
    }

    render() {
        const {theme, onSearch, onChangeShowTopGroupBooking, resultSearch} =
            this.props;
        const {textSearch, textDisplayResult} = this.state;

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        opacity: this.opacity,
                        transform: [{translateY: this.translateY}],
                    },
                ]}>
                <BannerBox
                    animateBanner
                    resultSearch={resultSearch}
                    textSearch={textDisplayResult}
                />

                <Animated.View
                    style={[
                        styles.searchView,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                            borderColor: theme.borderColor,
                        },
                    ]}>
                    <StyleTouchable
                        customStyle={styles.filterSearchBox}
                        onPress={() => {
                            onSearch(textSearch);
                            onChangeShowTopGroupBooking(!textSearch);
                            this.setState({
                                textDisplayResult: textSearch,
                            });
                        }}>
                        <AntDesign
                            name="search1"
                            style={[
                                styles.iconSearch,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                    <CustomInput
                        style={[styles.inputBox, {color: theme.textHightLight}]}
                        i18PlaceHolder="discovery.whereShouldWeGo"
                        placeholderTextColor={theme.holderColorLighter}
                        selectionColor={Theme.common.gradientTabBar1}
                        returnKeyType="search"
                        onChangeText={text =>
                            this.setState({
                                textSearch: text,
                            })
                        }
                        onSubmitEditing={() => {
                            onSearch(textSearch);
                            onChangeShowTopGroupBooking(!textSearch);
                            this.setState({
                                textDisplayResult: textSearch,
                            });
                        }}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: spaceHeight,
        position: 'absolute',
        top: 0,
    },
    // search
    searchView: {
        alignSelf: 'center',
        height: '40@ms',
        width: '80%',
        backgroundColor: 'green',
        borderRadius: '30@ms',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: '10@vs',
    },
    filterSearchBox: {
        width: '40@ms',
        height: '40@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSearch: {
        fontSize: '20@ms',
        marginLeft: '3@ms',
    },
    inputBox: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
    },
    // banner
    upperBox: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '15@s',
    },
    bannerTouch: {
        position: 'absolute',
        width: '100%',
        left: '15@s',
        alignItems: 'center',
    },
    titleBanner: {
        fontSize: '25@ms',
        color: Theme.common.white,
    },
    textBanner: {
        fontSize: FONT_SIZE.small,
        marginTop: '10@vs',
        color: Theme.common.textMe,
    },
    textTitleSearch: {
        fontSize: FONT_SIZE.normal,
        color: Theme.common.white,
    },
    textSearch: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.white,
    },
    itemResultBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '8@vs',
    },
});

export default SearchBar;