import {POST_TYPE, TOPIC} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import React, {Component} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, Platform, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import ItemFilterTopic from './components/ItemFilterTopic';

interface Props {
    listTopics: Array<number>;
    listPostTypes: Array<number>;
    onChangeTopic(listTopic: Array<number>): void;
    onChangePostType(listPostType: Array<number>): void;
    theme: TypeTheme;
}

interface States {
    tempListTopics: Array<number>;
    tempListPostTypes: Array<number>;
}

const containerHeight = verticalScale(170) + Metrics.safeTopPadding;

export default class HeaderFilterTopic extends Component<Props, States> {
    aim = new Animated.Value(0);

    state: States = {
        tempListTopics: this.props.listTopics,
        tempListPostTypes: this.props.listPostTypes,
    };

    turnOn = Animated.spring(this.aim, {
        toValue: 1,
        useNativeDriver: true,
    });

    turnOff = Animated.spring(this.aim, {
        toValue: 0,
        useNativeDriver: true,
    });

    shouldComponentUpdate(nextProps: Props, nextStates: States) {
        if (!isEqual(nextStates, this.state)) {
            return true;
        }
        if (
            !isEqual(nextProps.listTopics, this.props.listTopics) ||
            !isEqual(
                nextProps.theme.backgroundColor,
                this.props.theme.backgroundColor,
            )
        ) {
            return true;
        }
        return false;
    }

    show() {
        this.turnOn.stop();
        this.turnOn.start();
    }

    hide() {
        this.turnOff.stop();
        this.turnOff.start();
    }

    private onCancel() {
        this.setState({
            tempListTopics: this.props.listTopics,
        });
        this.hide();
    }

    private onSave() {
        this.props.onChangeTopic(this.state.tempListTopics);
        this.props.onChangePostType(this.state.tempListPostTypes);
        this.hide();
    }

    private onChooseTopic(topic: number) {
        let temp = [];
        if (this.state.tempListTopics.includes(topic)) {
            temp = this.state.tempListTopics.filter(item => item !== topic);
        } else {
            temp = this.state.tempListTopics.concat(topic);
        }

        if (!temp.length) {
            return;
        }

        this.setState({
            tempListTopics: temp,
        });
    }

    private onChoosePostType(postType: number) {
        let temp = [];
        if (this.state.tempListPostTypes.includes(postType)) {
            temp = this.state.tempListPostTypes.filter(
                item => item !== postType,
            );
        } else {
            temp = this.state.tempListPostTypes.concat(postType);
        }

        if (!temp.length) {
            return;
        }

        this.setState({
            tempListPostTypes: temp,
        });
    }

    Divider() {
        return (
            <View
                style={[
                    styles.divider,
                    {borderRightColor: this.props.theme.holderColorLighter},
                ]}
            />
        );
    }

    render() {
        const {theme} = this.props;
        const {tempListTopics, tempListPostTypes} = this.state;

        const translateY = this.aim.interpolate({
            inputRange: [0, 1],
            outputRange: [-containerHeight, 0],
        });
        const opacity = this.aim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        });

        const isTravel = tempListTopics.includes(TOPIC.travel);
        const isCuisine = tempListTopics.includes(TOPIC.cuisine);
        const isReview = tempListPostTypes.includes(POST_TYPE.review);
        const isGroupBuying = tempListPostTypes.includes(POST_TYPE.groupBuying);

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{translateY}],
                        backgroundColor: theme.backgroundColor,
                        opacity,
                    },
                ]}>
                <View style={[styles.topicView, {borderTopWidth: 0}]}>
                    <View style={styles.titleTopicBox}>
                        <StyleText
                            i18Text="discovery.chooseTopic"
                            customStyle={[
                                styles.title,
                                {color: theme.textColor},
                            ]}
                        />
                    </View>

                    {this.Divider()}

                    <View
                        style={[
                            styles.topicBox,
                            {borderTopColor: theme.holderColor},
                        ]}>
                        <ItemFilterTopic
                            isChosen={isTravel}
                            icon={Images.icons.travel}
                            title="profile.post.travel"
                            onPressTopic={() =>
                                this.onChooseTopic(TOPIC.travel)
                            }
                        />
                        <ItemFilterTopic
                            isChosen={isCuisine}
                            icon={Images.icons.cuisine}
                            title="profile.post.cuisine"
                            onPressTopic={() =>
                                this.onChooseTopic(TOPIC.cuisine)
                            }
                        />
                    </View>
                </View>

                <View
                    style={[
                        styles.topicView,
                        {borderTopColor: theme.holderColor},
                    ]}>
                    <View style={styles.titleTopicBox}>
                        <StyleText
                            i18Text="discovery.postType"
                            customStyle={[
                                styles.title,
                                {color: theme.textColor},
                            ]}
                        />
                    </View>

                    {this.Divider()}

                    <View style={styles.topicBox}>
                        <ItemFilterTopic
                            isChosen={isReview}
                            icon={Images.icons.star}
                            title="profile.createReviewPost"
                            onPressTopic={() =>
                                this.onChoosePostType(POST_TYPE.review)
                            }
                        />
                        <ItemFilterTopic
                            isChosen={isGroupBuying}
                            icon={Images.icons.house}
                            title="profile.createGroupBuying"
                            onPressTopic={() =>
                                this.onChoosePostType(POST_TYPE.groupBuying)
                            }
                        />
                    </View>
                </View>

                <View
                    style={[
                        styles.footerView,
                        {borderTopColor: theme.holderColorLighter},
                    ]}>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonTouch,
                            {
                                borderRightWidth: 0.5,
                                borderRightColor: theme.holderColorLighter,
                            },
                        ]}
                        onPress={() => this.onCancel()}>
                        <StyleText
                            i18Text="common.cancel"
                            customStyle={[
                                styles.textCancelSave,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </StyleTouchable>
                    <StyleTouchable
                        customStyle={styles.buttonTouch}
                        onPress={() => this.onSave()}>
                        <StyleText
                            i18Text="common.save"
                            customStyle={[
                                styles.textCancelSave,
                                {
                                    color: theme.highlightColor,
                                    fontWeight: 'bold',
                                },
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </Animated.View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: containerHeight,
        backgroundColor: 'red',
        borderBottomRightRadius: '15@ms',
        borderBottomLeftRadius: '15@ms',
        paddingTop: Metrics.safeTopPadding,
    },
    title: {
        fontSize: FONT_SIZE.small,
        alignSelf: 'center',
    },
    topicView: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: '5@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    titleTopicBox: {
        width: '30%',
        justifyContent: 'center',
    },
    topicBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: '10@vs',
        paddingHorizontal: '20@s',
    },
    footerView: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: '10@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    buttonTouch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCancelSave: {
        fontSize: FONT_SIZE.normal,
    },
    divider: {
        height: '100%',
        borderRightWidth: Platform.select({
            ios: '0.5@ms',
            android: '0.5@ms',
        }),
        alignSelf: 'center',
    },
});
