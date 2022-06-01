import {TypeCreateGroupResponse} from 'api/interface';
import {RELATIONSHIP_GROUP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale, ScaledSheet} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {chooseColorGradient} from 'utility/assistant';
import {bubbleHeight} from './Bubble';
import IconHobby from './IconHobby';

interface Props {
    item: TypeCreateGroupResponse;
    onJoinGroup(itemGroup: TypeCreateGroupResponse): void;
    onGoToConversation(chatTagId: string): void;
}

const BubblePalaceGroup = (props: Props) => {
    const {item, onJoinGroup, onGoToConversation} = props;

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const {gradient} = Redux.getResource();

    const image = item.images[0];
    const color = chooseColorGradient({
        listGradients: gradient,
        colorChoose: item.color,
    });

    /**
     * Render Image
     */
    const RenderImageBackground = () => {
        return (
            <StyleImage
                source={{uri: image}}
                customStyle={styles.imageBackground}
            />
        );
    };

    const RenderImage = () => {
        return (
            <View style={[styles.imageBox, {borderColor: theme.borderColor}]}>
                <StyleImage
                    source={{
                        uri: image,
                    }}
                    customStyle={styles.image}
                />
            </View>
        );
    };

    const RenderContent = () => {
        return (
            <View
                style={[styles.textView, {borderColor: theme.backgroundColor}]}>
                <View
                    style={[
                        styles.spaceBackground,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}
                />

                <View style={styles.iconHobbyBox}>
                    <IconHobby
                        color={item.color}
                        onTouchStart={() => null}
                        onTouchEnd={() => null}
                        containerStyle={{marginTop: 0}}
                    />
                </View>

                <View style={styles.contentBox}>
                    <StyleInput
                        value={item.content}
                        containerStyle={styles.inputContainer}
                        multiline
                        editable={false}
                        hasErrorBox={false}
                        hasUnderLine={false}
                        inputStyle={[
                            styles.input,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>
            </View>
        );
    };

    const RenderButtonJoinGroup = () => {
        const isNotJoined = item.relationship === RELATIONSHIP_GROUP.notJoined;

        let text = isNotJoined
            ? 'discovery.bubble.joinCommunity'
            : 'discovery.bubble.goToConversation';

        const onPress = () => {
            isNotJoined
                ? onJoinGroup(item)
                : onGoToConversation(item.chatTagId);
        };

        return (
            <StyleTouchable
                customStyle={[
                    styles.buttonJoinView,
                    {
                        borderColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}
                onPress={onPress}
                disable={isModeExp}>
                <MaterialIcons
                    name="groups"
                    style={[styles.iconGroup, {color: theme.borderColor}]}
                />
                <StyleText
                    i18Text={text}
                    customStyle={[
                        styles.textJoin,
                        {color: theme.joinGroupChat},
                    ]}
                />
            </StyleTouchable>
        );
    };

    return (
        <LinearGradient
            style={styles.container}
            colors={color}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            {RenderImageBackground()}
            {RenderImage()}
            {RenderContent()}
            {RenderButtonJoinGroup()}
        </LinearGradient>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: bubbleHeight,
        alignItems: 'center',
        padding: '15@ms',
    },
    imageBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.5,
        top: '15@ms',
        borderRadius: '10@ms',
    },
    imageBox: {
        width: bubbleHeight * 0.35,
        height: bubbleHeight * 0.35,
        borderRadius: '300@s',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '6@ms',
        marginTop: '60@vs',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textView: {
        width: Metrics.width * 0.6 + scale(100),
        maxHeight: '130@vs',
        flexDirection: 'row',
        borderWidth: '0@ms',
        borderRadius: '10@ms',
        marginTop: '20@vs',
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.95,
        borderRadius: '10@ms',
    },
    iconHobbyBox: {
        height: '100%',
        paddingLeft: '20@s',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '15@vs',
    },
    iconThemeBox: {
        width: '45@ms',
        height: '45@ms',
        borderRadius: '30@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTheme: {
        fontSize: '25@ms',
    },
    iconToolUpBox: {
        borderRadius: '15@ms',
        width: '80@ms',
        height: '80@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        fontSize: '30@ms',
    },
    contentBox: {
        flex: 1,
        paddingHorizontal: '20@s',
        paddingVertical: '15@vs',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        fontSize: '14@ms',
        paddingHorizontal: 0,
    },
    // button join
    buttonJoinView: {
        paddingVertical: '5@vs',
        paddingHorizontal: '30@s',
        borderWidth: '1@ms',
        borderRadius: '100@ms',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '15%',
    },
    iconGroup: {
        fontSize: '25@ms',
        marginRight: '10@s',
    },
    textJoin: {
        fontSize: '13@ms',
        fontWeight: 'bold',
    },
});

export default memo(BubblePalaceGroup, (preProps: Props, nextProps: any) => {
    if (!isEqual(nextProps.item, preProps.item)) {
        return false;
    }
    return true;
});
