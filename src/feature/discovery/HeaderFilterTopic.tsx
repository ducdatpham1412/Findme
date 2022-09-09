import {TOPIC} from 'asset/enum';
import Images from 'asset/img/images';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import React, {Component} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, Platform, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import ItemFilterTopic from './components/ItemFilterTopic';

interface Props {
    listTopics: Array<number>;
    onChangeTopic(listTopic: Array<number>): void;
    theme: TypeTheme;
}

interface States {
    tempListTopics: Array<number>;
}

const containerHeight = verticalScale(170);

export default class HeaderFilterTopic extends Component<Props, States> {
    aim = new Animated.Value(0);

    state = {
        tempListTopics: this.props.listTopics,
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

    render() {
        const {theme} = this.props;
        const {tempListTopics} = this.state;

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

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{translateY}],
                        backgroundColor: theme.backgroundColorSecond,
                        opacity,
                    },
                ]}>
                <StyleText
                    i18Text="discovery.chooseTopic"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />

                <View
                    style={[
                        styles.topicView,
                        {borderTopColor: theme.holderColor},
                    ]}>
                    <ItemFilterTopic
                        isChosen={isTravel}
                        icon={Images.icons.travel}
                        title="profile.post.travel"
                        onPressTopic={() => this.onChooseTopic(TOPIC.travel)}
                    />
                    <ItemFilterTopic
                        isChosen={isCuisine}
                        icon={Images.icons.cuisine}
                        title="profile.post.cuisine"
                        onPressTopic={() => this.onChooseTopic(TOPIC.cuisine)}
                    />
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
    },
    title: {
        fontSize: '14@ms',
        alignSelf: 'center',
        marginTop: '10@vs',
    },
    topicView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: '10@vs',
        paddingVertical: '10@vs',
        paddingHorizontal: '20@s',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    footerView: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: '15@vs',
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
        fontSize: '14@ms',
    },
});
