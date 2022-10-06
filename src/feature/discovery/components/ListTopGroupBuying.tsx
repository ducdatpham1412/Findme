import {apiGetTopGroupBuying} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert} from 'navigation/NavigationService';
import React, {Component, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Animated,
    Platform,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';
import {
    moderateScale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Theme, {TypeTheme} from 'asset/theme/Theme';

const {width} = Metrics;
const itemWidth = width * 0.7;
export const spaceHeight = width * 0.5;

interface Props {
    theme: TypeTheme;
    onSearch(value: string): void;
}

interface InputProps extends TextInputProps {
    i18PlaceHolder: I18Normalize;
}

interface BannerProps {
    animateBanner: boolean;
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

const ListUnder = () => {
    const theme = Redux.getTheme();

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

    return (
        <View
            style={[
                styles.underContainer,
                {backgroundColor: theme.backgroundColor},
            ]}>
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
                        detailGroupTarget={DISCOVERY_ROUTE.detailGroupBuying}
                        syncWidth={itemWidth}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                refreshing={false}
                directionalLockEnabled
            />
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

const BannerBox = ({animateBanner}: BannerProps) => {
    const timeOutCheck = useRef<any>(null);
    const opacityBanner1 = useRef(new Animated.Value(1)).current;
    const opacityBanner2 = useRef(new Animated.Value(0)).current;
    const [tabFocus, setTabFocus] = useState(0);

    useEffect(() => {
        if (!animateBanner) {
            clearInterval(timeOutCheck.current);
        } else {
            timeOutCheck.current = setInterval(() => {
                setTabFocus(preValue => {
                    return preValue === 0 ? 1 : 0;
                });
            }, 6000);
        }
    }, [animateBanner]);

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
        </View>
    );
};

class ListTopGroupBuying extends Component<Props> {
    opacity = new Animated.Value(1);

    state = {
        animateBanner: true,
    };

    setOpacity(value: number) {
        this.opacity.setValue(value);
        if (value === 0) {
            this.setState({
                animateBanner: false,
            });
        } else if (value === 1) {
            this.setState({
                animateBanner: true,
            });
        }
    }

    render() {
        const {theme} = this.props;

        return (
            <>
                <View style={styles.container}>
                    <BannerBox animateBanner={this.state.animateBanner} />

                    <Animated.View
                        style={[
                            styles.searchView,
                            {
                                backgroundColor: theme.backgroundButtonColor,
                                borderColor: theme.borderColor,
                                opacity: this.opacity,
                            },
                        ]}>
                        <StyleTouchable customStyle={styles.filterSearchBox}>
                            <AntDesign
                                name="search1"
                                style={[
                                    styles.iconSearch,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                        <CustomInput
                            style={[
                                styles.inputBox,
                                {color: theme.textHightLight},
                            ]}
                            i18PlaceHolder="discovery.whereShouldWeGo"
                            placeholderTextColor={theme.holderColorLighter}
                            selectionColor={Theme.common.gradientTabBar1}
                            returnKeyType="search"
                        />
                    </Animated.View>
                </View>

                <ListUnder />
            </>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: spaceHeight,
    },
    underContainer: {
        width: '100%',
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
    },
    titleGroupBooking: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        left: '10@s',
        marginTop: '20@vs',
        marginBottom: '15@vs',
    },
    titleDiscovery: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        left: '10@s',
        marginTop: '15@vs',
    },
    itemView: {
        marginLeft: '5@s',
        marginRight: '10@s',
        marginTop: 0,
    },
    searchView: {
        position: 'absolute',
        alignSelf: 'center',
        height: '40@ms',
        width: '80%',
        backgroundColor: 'green',
        bottom: '10@vs',
        borderRadius: '30@ms',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
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
    upperBox: {
        width: '100%',
        height: spaceHeight - moderateScale(40) - verticalScale(10),
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
});

export default ListTopGroupBuying;
