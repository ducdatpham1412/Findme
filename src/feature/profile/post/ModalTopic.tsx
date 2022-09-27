import {LIST_FEELINGS, LIST_TOPICS} from 'asset/standardValue';
import {
    StyleButton,
    StyleIcon,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Animated, Platform, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    topics: Array<number>;
    onChangeListTopics(value: Array<number>): void;
}

const IconChoose = ({item, textColor, isChosen}: any) => {
    const aim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isChosen) {
            Animated.spring(aim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(aim, {
                toValue: 0.7,
                useNativeDriver: true,
            }).start();
        }
    }, [isChosen]);

    return (
        <Animated.View
            style={[
                styles.topicTouch,
                {transform: [{scale: aim}], opacity: aim},
            ]}>
            <StyleIcon source={item.icon} size={40} />
            <StyleText
                i18Text={item.text}
                customStyle={[styles.textFeeling, {color: textColor}]}
            />
        </Animated.View>
    );
};

const ModalTopic = (props: Props, ref: any) => {
    const {onChangeListTopics, topics} = props;
    const theme = Redux.getTheme();

    const [tempTopics, setTempTopics] = useState(topics);

    const onChoose = (topicId: any) => {
        if (tempTopics.includes(topicId)) {
            setTempTopics(tempTopics.filter(id => id !== topicId));
        } else {
            setTempTopics(tempTopics.concat(topicId));
        }
    };

    const onSave = () => {
        onChangeListTopics(tempTopics);
        ref.current.close();
    };

    const onClose = () => {
        setTempTopics(topics);
        ref.current.close();
    };

    return (
        <Modalize
            ref={ref}
            modalStyle={styles.modal}
            withHandle={false}
            overlayStyle={{
                backgroundColor: theme.backgroundOpacity(),
            }}>
            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <ButtonX
                    containerStyle={styles.buttonClose}
                    onPress={onClose}
                />
                <StyleText
                    i18Text="profile.post.topic"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />
                <View style={styles.topicView}>
                    {LIST_TOPICS.map((item, index) => {
                        const borderRightColor =
                            index !== LIST_FEELINGS.length - 1
                                ? theme.borderColor
                                : 'transparent';
                        return (
                            <StyleTouchable
                                key={item.id}
                                customStyle={[
                                    styles.topicBox,
                                    {borderRightColor},
                                ]}
                                onPress={() => onChoose(item.id)}>
                                <IconChoose
                                    item={item}
                                    textColor={theme.textColor}
                                    isChosen={tempTopics.includes(item.id)}
                                />
                            </StyleTouchable>
                        );
                    })}
                </View>

                <StyleButton
                    title="common.save"
                    onPress={onSave}
                    containerStyle={styles.buttonView}
                />
            </View>
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: '90%',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        marginTop: '100@vs',
        alignSelf: 'center',
        borderRadius: '7@ms',
        alignItems: 'center',
    },
    buttonClose: {
        position: 'absolute',
        top: '7@s',
        right: '7@s',
    },
    title: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    topicView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '25@vs',
        justifyContent: 'space-between',
    },
    topicBox: {
        flex: 1,
        borderRightWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    topicTouch: {
        flex: 1,
        alignItems: 'center',
    },
    textFeeling: {
        fontSize: '8@ms',
        marginTop: '10@vs',
    },
    buttonView: {
        paddingVertical: '8@vs',
        marginTop: '30@vs',
    },
});

export default forwardRef(ModalTopic);
