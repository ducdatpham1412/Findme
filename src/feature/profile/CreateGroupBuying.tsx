import {apiCreateGroupBuying, apiEditGroupBooking} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {TypeCreateGroupBuying} from 'api/interface/discovery';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleContainer,
    StyleIcon,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import LoadingScreen from 'components/LoadingScreen';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {Component, useMemo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {Animated, Platform, TextInput, Vibration, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {chooseIconTopic, onGoToSignUp} from 'utility/assistant';
import {
    addDate,
    formatDayGroupBuying,
    formatLocaleNumber,
    formatUTCDate,
} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';
import PreviewVideo from './components/PreviewVideo';
import ModalAddPrice from './post/ModalAddPrice';
import ModalApplicationPeriod from './post/ModalApplicationPeriod';
import ModalMaxGroups from './post/ModalMaxGroups';
import ModalRetailPrice from './post/ModalRetailPrice';
import ModalTopic from './post/ModalTopic';

interface Props {
    route: {
        params: {
            itemNew?: {
                images: Array<string>;
                isVideo: boolean;
            };
            itemEdit?: TypeGroupBuying;
            itemDraft?: TypeGroupBuying;
            itemError?: TypeCreateGroupBuying; // change this to type create gb
        };
    };
}

interface AddInfoProps {
    borderColor: string;
    titleColor: string;
    title: I18Normalize;
    onPress(): void;
}

const {width, safeBottomPadding} = Metrics;

class AddInfoButton extends Component<AddInfoProps> {
    scale = new Animated.Value(1);

    translateX = new Animated.Value(0);

    slug() {
        Vibration.vibrate();
        Animated.timing(this.scale, {
            toValue: 1.5,
            useNativeDriver: true,
            duration: 100,
        }).start(() => {
            Animated.sequence([
                Animated.timing(this.translateX, {
                    toValue: 10,
                    duration: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(this.translateX, {
                    toValue: -10,
                    duration: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(this.translateX, {
                    toValue: 10,
                    duration: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(this.translateX, {
                    toValue: 0,
                    duration: 60,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                Animated.timing(this.scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 100,
                }).start();
            });
        });
    }

    render() {
        const {borderColor, titleColor, title, onPress} = this.props;
        return (
            <View style={styles.topicView}>
                <Animated.View
                    style={{
                        transform: [
                            {scale: this.scale},
                            {translateX: this.translateX},
                        ],
                    }}>
                    <StyleTouchable
                        customStyle={[styles.chooseTopicView, {borderColor}]}
                        onPress={onPress}>
                        <AntDesign
                            name="plus"
                            style={[
                                styles.iconTopic,
                                {color: Theme.common.gradientTabBar1},
                            ]}
                        />
                        <StyleText
                            i18Text={title}
                            customStyle={[
                                styles.textTopic,
                                {color: titleColor, fontWeight: 'bold'},
                            ]}
                        />
                    </StyleTouchable>
                </Animated.View>
            </View>
        );
    }
}

const CreateGroupBuying = ({route}: Props) => {
    const itemNew = useRef(route.params?.itemNew).current;
    const itemEdit = useRef(route.params?.itemEdit).current;
    const itemError = useRef(route.params?.itemError).current;
    const itemDraft = useRef(route.params?.itemDraft).current;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    const isLoading = Redux.getIsLoading();
    const {t} = useTranslation();

    const initValue = useMemo(() => {
        return {
            topics:
                itemEdit?.topic || itemError?.topic || itemDraft?.topic || [],
            content:
                itemEdit?.content ||
                itemError?.content ||
                itemDraft?.content ||
                '',
            images:
                itemEdit?.images ||
                itemError?.images ||
                itemDraft?.images ||
                itemNew?.images ||
                [],
            retailPrice:
                itemEdit?.retailPrice ||
                itemError?.retailPrice ||
                itemDraft?.retailPrice ||
                '',
            groupPrices:
                itemEdit?.prices ||
                itemError?.prices ||
                itemDraft?.prices ||
                [],
            maxGroups:
                itemEdit?.maxGroups ||
                itemError?.maxGroups ||
                itemDraft?.maxGroups ||
                1,
            startDate:
                itemEdit?.startDate ||
                itemError?.startDate ||
                itemDraft?.startDate ||
                null,
            endDate:
                itemEdit?.endDate ||
                itemError?.endDate ||
                itemDraft?.endDate ||
                null,
            deadlineDate:
                itemEdit?.deadlineDate ||
                itemError?.deadlineDate ||
                itemDraft?.deadlineDate ||
                null,
        };
    }, []);

    const [topics, setTopics] = useState(initValue.topics);
    const [content, setContent] = useState(initValue.content);
    const [images] = useState(initValue.images);
    const [retailPrice, setRetailPrice] = useState(initValue.retailPrice);
    const [groupPrices, setGroupPrices] = useState(initValue.groupPrices);
    const [deadlineDate, setDeadlineDate] = useState(initValue.deadlineDate);
    const [startDate, setStartDate] = useState(initValue.startDate);
    const [endDate, setEndDate] = useState(initValue.endDate);

    const modalTopicRef = useRef<Modalize>(null);
    const modalDeadlineRef = useRef<ClassDateTimePicker>(null);
    const modalMaxGroups = ModalMaxGroups();
    const modalApplicationRef = useRef<ModalApplicationPeriod>(null);
    const modalRetailPriceRef = useRef<ModalRetailPrice>(null);
    const modalPriceRef = useRef<ModalAddPrice>(null);

    const buttonTopicRef = useRef<AddInfoButton>(null);
    const buttonDeadlineRef = useRef<AddInfoButton>(null);
    const buttonApplicationRef = useRef<AddInfoButton>(null);
    const buttonRetailPriceRef = useRef<AddInfoButton>(null);
    const buttonAddPriceRef = useRef<AddInfoButton>(null);

    const onConfirmPost = async (isDraft: boolean) => {
        if (!topics.length) {
            Vibration.vibrate();
            buttonTopicRef.current?.slug();
            return;
        }
        if (!startDate || !endDate) {
            Vibration.vibrate();
            buttonApplicationRef.current?.slug();
            return;
        }
        if (!deadlineDate) {
            Vibration.vibrate();
            buttonDeadlineRef.current?.slug();
            return;
        }
        if (!retailPrice) {
            Vibration.vibrate();
            buttonRetailPriceRef.current?.slug();
            return;
        }
        if (groupPrices.length === 0) {
            Vibration.vibrate();
            buttonAddPriceRef.current?.slug();
            return;
        }

        if (!isModeExp && token) {
            const newGroupBuying: TypeCreateGroupBuying = {
                topic: topics,
                content,
                images,
                retailPrice,
                prices: groupPrices,
                maxGroups: Number(modalMaxGroups.maxGroups),
                startDate: String(formatUTCDate(startDate)),
                endDate: String(formatUTCDate(endDate)),
                deadlineDate: String(formatUTCDate(deadlineDate)),
                isDraft,
            };
            try {
                Redux.setPostCreatedHandling({
                    status: 'loading',
                    data: newGroupBuying,
                });
                navigate(ROOT_SCREEN.mainScreen);
                const listNameImages = await ImageUploader.upLoadManyImg(
                    newGroupBuying.images,
                    1000,
                );
                // const listNameImages = ['21666863951481.jpeg'];
                const res = await apiCreateGroupBuying({
                    ...newGroupBuying,
                    images: listNameImages,
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewGroupBuying,
                    payload: res.data,
                });
                Redux.setPostCreatedHandling({
                    status: 'success',
                    data: newGroupBuying,
                });
            } catch (err) {
                Redux.setPostCreatedHandling({
                    status: 'error',
                    data: newGroupBuying,
                });
                appAlert(err);
            }
        } else {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
            });
        }
    };

    const onEditPost = async () => {
        if (itemEdit) {
            try {
                Redux.setIsLoading(true);
                await apiEditGroupBooking({
                    postId: itemEdit.id,
                    content,
                    topic: topics,
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        } else if (itemDraft) {
            try {
                Redux.setIsLoading(true);
                await apiEditGroupBooking({
                    postId: itemDraft.id,
                    content,
                    topic: topics,
                    is_public_from_draft: true,
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    const onGoBack = () => {
        const temp: typeof initValue = {
            topics,
            content,
            images,
            retailPrice,
            groupPrices,
            maxGroups: Number(modalMaxGroups.maxGroups),
            deadlineDate,
            startDate,
            endDate,
        };
        if (!isEqual(temp, initValue)) {
            appAlertYesNo({
                i18Title: 'common.wantToDiscard',
                agreeText: 'common.discard',
                refuseText: 'common.stay',
                agreeChange: () => {
                    goBack();
                    goBack();
                },
                refuseChange: goBack,
            });
        } else {
            goBack();
        }
    };

    /**
     * Render views
     */
    const Header = () => {
        return (
            <View
                style={[
                    styles.headerView,
                    {
                        borderBottomColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                <StyleTouchable
                    customStyle={styles.iconCloseView}
                    onPress={onGoBack}>
                    <Ionicons
                        name="chevron-back"
                        style={[styles.iconClose, {color: theme.textColor}]}
                    />
                </StyleTouchable>

                {(itemNew || itemError || itemDraft) && (
                    <StyleTouchable
                        customStyle={[
                            styles.postBox,
                            {
                                backgroundColor: theme.highlightColor,
                            },
                        ]}
                        onPress={() => {
                            if (itemDraft) {
                                onEditPost();
                            } else {
                                onConfirmPost(false);
                            }
                        }}>
                        <StyleText
                            i18Text="profile.post.post"
                            customStyle={[
                                styles.textPost,
                                {color: theme.backgroundColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {(itemNew || itemError) && (
                    <StyleTouchable
                        customStyle={[
                            styles.draftBox,
                            {
                                backgroundColor: theme.borderColor,
                            },
                        ]}
                        onPress={() => onConfirmPost(true)}>
                        <StyleText
                            i18Text="profile.post.draft"
                            customStyle={[
                                styles.textDraft,
                                {color: theme.backgroundColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {itemEdit && (
                    <StyleTouchable
                        customStyle={[
                            styles.postBox,
                            {backgroundColor: theme.highlightColor},
                        ]}
                        onPress={() => onEditPost()}>
                        <StyleText
                            i18Text="profile.post.edit"
                            customStyle={[
                                styles.textPost,
                                {color: theme.backgroundColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const ImagePreview = useMemo(() => {
        if (itemNew?.isVideo) {
            return <PreviewVideo uri={images[0]} />;
        }
        return <ScrollSyncSizeImage images={images} syncWidth={width} />;
    }, []);

    const Topic = () => {
        if (topics.length === 0) {
            return (
                <AddInfoButton
                    ref={buttonTopicRef}
                    borderColor={theme.borderColor}
                    titleColor={theme.textHightLight}
                    title="profile.post.topic"
                    onPress={() => modalTopicRef.current?.open()}
                />
            );
        }

        return (
            <StyleTouchable
                customStyle={styles.topicView}
                onPress={() => modalTopicRef.current?.open()}>
                {topics.map(id => {
                    const chosenTopic = chooseIconTopic(id);
                    return (
                        <StyleIcon
                            key={id}
                            source={chosenTopic}
                            size={25}
                            customStyle={styles.iconTopicView}
                        />
                    );
                })}
            </StyleTouchable>
        );
    };

    const Deadline = () => {
        if (!deadlineDate) {
            return (
                <AddInfoButton
                    ref={buttonDeadlineRef}
                    borderColor={theme.borderColor}
                    titleColor={theme.textHightLight}
                    title="profile.subscriptionDeadline"
                    onPress={() => {
                        modalDeadlineRef.current?.show();
                    }}
                />
            );
        }
        return (
            <>
                <View style={styles.topicView}>
                    <StyleTouchable
                        customStyle={[
                            styles.chooseTopicView,
                            {borderColor: theme.borderColor},
                        ]}
                        onPress={() => {
                            modalDeadlineRef.current?.show();
                        }}>
                        <StyleIcon source={Images.icons.deadline} size={15} />
                        <StyleText
                            originValue={formatDayGroupBuying(deadlineDate)}
                            customStyle={[
                                styles.textTopic,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
                <View style={styles.noteBox}>
                    {/* <AntDesign
                        name="pushpino"
                        style={[styles.iconPin, {color: theme.highlightColor}]}
                    /> */}
                    <StyleText
                        i18Text="alert.deadlineDateBefore"
                        i18Params={{
                            value: startDate
                                ? formatDayGroupBuying(startDate)
                                : '',
                        }}
                        customStyle={[
                            styles.textNote,
                            {color: theme.holderColorLighter},
                        ]}
                    />
                </View>
            </>
        );
    };

    const MaxGroups = () => {
        return (
            <View style={styles.topicView}>
                <StyleTouchable
                    customStyle={[
                        styles.chooseTopicView,
                        {borderColor: theme.borderColor},
                    ]}
                    onPress={() => modalMaxGroups.showModal()}>
                    <StyleIcon
                        source={Images.icons.createGroup}
                        size={15}
                        customStyle={{
                            tintColor: Theme.common.gradientTabBar1,
                        }}
                    />
                    <StyleText
                        i18Text="profile.maxGroups"
                        customStyle={[
                            styles.textTopic,
                            {color: theme.textHightLight},
                        ]}>
                        <StyleText
                            originValue={`: ${modalMaxGroups.maxGroups}`}
                            customStyle={[
                                styles.textTopic,
                                {
                                    color: theme.textHightLight,
                                    fontWeight: 'bold',
                                },
                            ]}
                        />
                    </StyleText>
                </StyleTouchable>
            </View>
        );
    };

    const TouringTime = () => {
        if (!startDate || !endDate) {
            return (
                <AddInfoButton
                    ref={buttonApplicationRef}
                    borderColor={theme.borderColor}
                    titleColor={theme.textHightLight}
                    title="discovery.applicationPeriod"
                    onPress={() => modalApplicationRef.current?.show()}
                />
            );
        }
        return (
            <>
                <View style={styles.topicView}>
                    <StyleTouchable
                        customStyle={[
                            styles.chooseTopicView,
                            {borderColor: theme.borderColor},
                        ]}
                        onPress={() => {
                            modalApplicationRef.current?.show();
                        }}
                        disable={!!itemEdit}
                        disableOpacity={1}>
                        <StyleIcon source={Images.icons.calendar} size={15} />
                        <StyleText
                            originValue={`${formatDayGroupBuying(
                                startDate,
                            )} ~ ${formatDayGroupBuying(endDate)}`}
                            customStyle={[
                                styles.textTopic,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleTouchable>
                </View>

                {!!itemEdit && (
                    <View style={styles.noteBox}>
                        {/* <AntDesign
                        name="pushpino"
                        style={[styles.iconPin, {color: theme.highlightColor}]}
                    /> */}
                        <StyleText
                            i18Text="alert.canNotEditStartTimeAndPrice"
                            customStyle={[
                                styles.textNote,
                                {color: theme.holderColorLighter},
                            ]}
                        />
                    </View>
                )}
            </>
        );
    };

    const RetailPrice = () => {
        return (
            <View
                style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
                <View style={styles.titlePriceView}>
                    <StyleIcon source={Images.icons.dollar} size={18} />
                    <StyleText
                        i18Text="discovery.retailPrice"
                        customStyle={[
                            styles.textTitlePrice,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>

                {retailPrice ? (
                    <View style={styles.priceBox}>
                        <StyleTouchable
                            customStyle={[
                                styles.priceValue,
                                {
                                    borderColor: theme.highlightColor,
                                    flex: undefined,
                                },
                            ]}
                            onPress={() => {
                                if (!itemEdit) {
                                    modalRetailPriceRef.current?.show();
                                }
                            }}>
                            <StyleText
                                originValue={`${formatLocaleNumber(
                                    retailPrice,
                                )} vnd`}
                                customStyle={[
                                    styles.textNumberPeople,
                                    {
                                        color: theme.highlightColor,
                                        fontWeight: 'bold',
                                    },
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                ) : (
                    <AddInfoButton
                        ref={buttonRetailPriceRef}
                        title="profile.addPrice"
                        titleColor={theme.textHightLight}
                        borderColor={theme.borderColor}
                        onPress={() => {
                            if (!itemEdit) {
                                modalRetailPriceRef.current?.show();
                            }
                        }}
                    />
                )}
            </View>
        );
    };

    const GroupBuyingPrices = () => {
        const onDeletePrice = (valuePrice: string) => {
            setGroupPrices(preValue =>
                preValue.filter(item => item.value !== valuePrice),
            );
        };

        return (
            <View
                style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
                <View style={styles.titlePriceView}>
                    <StyleIcon source={Images.icons.dollar} size={18} />
                    <StyleText
                        i18Text="discovery.groupBuyingPrice"
                        customStyle={[
                            styles.textTitlePrice,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>

                {groupPrices.map((price, index) => {
                    return (
                        <StyleTouchable
                            key={price.number_people}
                            customStyle={styles.priceBox}
                            onPress={() => {
                                modalPriceRef.current?.show({
                                    numberPeople: String(price.number_people),
                                    priceValue: price.value,
                                    indexEdit: index,
                                });
                            }}>
                            <View
                                style={[
                                    styles.priceNumberPeople,
                                    {borderColor: theme.borderColor},
                                ]}>
                                <StyleText
                                    originValue={price.number_people}
                                    customStyle={[
                                        styles.textNumberPeople,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </View>
                            <StyleText
                                originValue="-"
                                customStyle={[
                                    styles.textMiddle,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <View
                                style={[
                                    styles.priceValue,
                                    {borderColor: theme.highlightColor},
                                ]}>
                                <StyleText
                                    originValue={`${formatLocaleNumber(
                                        price.value,
                                    )} vnd`}
                                    customStyle={[
                                        styles.textNumberPeople,
                                        {
                                            color: theme.highlightColor,
                                            fontWeight: 'bold',
                                        },
                                    ]}
                                />
                            </View>
                            {!itemEdit && (
                                <StyleTouchable
                                    customStyle={styles.deleteBox}
                                    hitSlop={10}
                                    onPress={() => onDeletePrice(price.value)}>
                                    <Feather
                                        name="x"
                                        style={[
                                            styles.iconDelete,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            )}
                        </StyleTouchable>
                    );
                })}

                {!itemEdit && (
                    <AddInfoButton
                        ref={buttonAddPriceRef}
                        title="profile.addPrice"
                        titleColor={theme.textHightLight}
                        borderColor={theme.borderColor}
                        onPress={() => modalPriceRef.current?.show()}
                    />
                )}
            </View>
        );
    };

    const scrollRef = useRef<KeyboardAwareScrollView>(null);

    const Content = () => {
        return (
            <View
                style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
                <TextInput
                    onChangeText={text => {
                        scrollRef.current?.scrollToEnd();
                        setContent(text);
                    }}
                    multiline
                    placeholder={t('common.writeSomething')}
                    placeholderTextColor={theme.borderColor}
                    style={[styles.inputContent, {color: theme.textHightLight}]}
                    defaultValue={initValue.content}
                />
            </View>
        );
    };

    return (
        <>
            <ViewSafeTopPadding />
            {Header()}

            <StyleContainer
                ref={scrollRef}
                containerStyle={styles.container}
                scrollEnabled
                customStyle={styles.contentContainer}
                extraHeight={80}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag">
                {ImagePreview}
                <View style={styles.contentView}>
                    {Topic()}
                    {TouringTime()}
                    {Deadline()}
                    {MaxGroups()}
                    {RetailPrice()}
                    {GroupBuyingPrices()}
                    {Content()}
                </View>
            </StyleContainer>

            <ModalTopic
                ref={modalTopicRef}
                topics={topics}
                onChangeListTopics={value => {
                    setTopics(value);
                }}
            />

            <ModalApplicationPeriod
                ref={modalApplicationRef}
                theme={theme}
                startDate={startDate}
                endDate={endDate}
                onChangeDate={value => {
                    setDeadlineDate(null);
                    setStartDate(String(value.startDate));
                    setEndDate(String(value.endDate));
                }}
            />
            <ClassDateTimePicker
                ref={modalDeadlineRef}
                initDate={deadlineDate ? new Date(deadlineDate) : new Date()}
                minimumDate={new Date()}
                maximumDate={
                    startDate
                        ? new Date(addDate(startDate, {value: -1, unit: 'day'}))
                        : undefined
                }
                onChangeDateTime={value => setDeadlineDate(String(value))}
                theme={theme}
            />
            <ModalRetailPrice
                ref={modalRetailPriceRef}
                theme={theme}
                price={retailPrice}
                onChangePrice={value => setRetailPrice(value)}
            />
            <ModalAddPrice
                ref={modalPriceRef}
                theme={theme}
                prices={groupPrices}
                onAddPrice={value => setGroupPrices(groupPrices.concat(value))}
                onChangePrice={e => {
                    setGroupPrices(preValue =>
                        preValue.map((item, index) => {
                            if (index !== e.indexEdit) {
                                return item;
                            }
                            return {
                                ...item,
                                number_people: e.value.number_people,
                                value: e.value.value,
                            };
                        }),
                    );
                }}
            />

            {modalMaxGroups.jsx}

            {isLoading && <LoadingScreen />}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: safeBottomPadding + 30,
    },
    // header
    headerView: {
        width: '100%',
        paddingVertical: '5@vs',
        paddingHorizontal: '15@s',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    iconCloseView: {
        position: 'absolute',
        right: '10@s',
    },
    iconClose: {
        fontSize: '25@ms',
    },
    postBox: {
        paddingHorizontal: '25@s',
        paddingVertical: '3@vs',
        borderRadius: '8@ms',
    },
    textPost: {
        fontSize: '14@ms',
        fontWeight: 'bold',
    },
    draftBox: {
        paddingHorizontal: '15@s',
        paddingVertical: '3@vs',
        borderRadius: '8@ms',
        marginRight: '10@s',
    },
    textDraft: {
        fontSize: '14@ms',
    },
    contentView: {
        width: '100%',
        paddingHorizontal: '15@s',
    },
    topicView: {
        flexDirection: 'row',
        marginTop: '10@vs',
    },
    iconTopicView: {
        marginRight: '20@s',
    },
    chooseTopicView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingHorizontal: '13@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    iconTopic: {
        fontSize: '15@ms',
    },
    textTopic: {
        fontSize: FONT_SIZE.small,
        marginLeft: '7@s',
    },
    // titlePrice
    priceView: {
        marginTop: '15@vs',
        paddingTop: '5@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingHorizontal: '10@s',
    },
    inputContent: {
        fontSize: FONT_SIZE.normal,
    },
    titlePriceView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textTitlePrice: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginLeft: '5@s',
    },
    priceBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    priceNumberPeople: {
        flex: 1,
        paddingVertical: '7@vs',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderRadius: '5@ms',
        alignItems: 'center',
    },
    textMiddle: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '10@s',
    },
    priceValue: {
        flex: 2,
        paddingVertical: '7@vs',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderRadius: '5@ms',
        paddingHorizontal: '20@s',
    },
    deleteBox: {
        marginLeft: '10@s',
    },
    iconDelete: {
        fontSize: '20@ms',
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.small,
    },
    noteBox: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '5@vs',
        alignItems: 'center',
    },
    iconPin: {
        fontSize: '10@ms',
    },
    textNote: {
        fontSize: FONT_SIZE.tiny,
        marginLeft: '5@s',
    },
});

export default CreateGroupBuying;
