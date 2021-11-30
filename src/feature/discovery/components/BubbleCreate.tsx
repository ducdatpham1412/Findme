import {TypeMyBubbles} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {DELAY_LONG_PRESS} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import Svg, {Path} from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BubbleProps {
    item: TypeMyBubbles;
    containerStyle?: StyleProp<ViewStyle>;
    showCreateBubble?: boolean;
    editBubble: any;
    deleteBubble: any;
}

const BubbleCreate = (props: BubbleProps) => {
    const {
        item,
        containerStyle,
        // showCreateBubble,
        editBubble,
        deleteBubble,
    } = props;
    const theme = Redux.getTheme();
    const [flagSize, setFlagSize] = useState({width: 0, height: 0});
    const [showChoice, setShowChoice] = useState(false);

    // return BtnCreateBubble if not have bubbles
    if (!item) {
        return (
            <StyleTouchable
                customStyle={styles.btnCreateView}
                onPress={editBubble}>
                <Ionicons
                    name="create-outline"
                    style={[styles.iconCreate, {color: theme.borderColor}]}
                />
            </StyleTouchable>
        );
    }

    // if bubbles is defined, return Bubbles
    const {icon, description, name} = item;
    const dPath = `M0 3 L${flagSize.width} 3 L${flagSize.width - 10} ${
        flagSize.height / 2
    } L${flagSize.width} ${flagSize.height - 3} L0 ${flagSize.height - 3} L10 ${
        flagSize.height / 2
    } L0 3`;

    const onLongPress = () => {
        setShowChoice(true);
        setTimeout(() => {
            setShowChoice(false);
        }, 3000);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Choice delete or edit bubble */}
            {showChoice && (
                <View style={styles.choiceBox}>
                    <View style={styles.choiceDelete}>
                        <StyleTouchable onPress={deleteBubble}>
                            <Feather
                                name="x"
                                style={[
                                    styles.iconDelete,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                    <StyleTouchable
                        customStyle={styles.choiceEdit}
                        onPress={editBubble}>
                        <AntDesign
                            name="edit"
                            style={[styles.iconEdit, {color: theme.textColor}]}
                        />
                    </StyleTouchable>
                </View>
            )}

            {/* Bubble */}
            <StyleTouchable
                customStyle={[
                    styles.avatarBox,
                    {borderColor: theme.highlightColor},
                ]}
                onLongPress={onLongPress}
                delayLongPress={DELAY_LONG_PRESS}
                onPress={editBubble}>
                <StyleImage
                    source={{uri: item.privateAvatar}}
                    customStyle={{width: '100%', height: '100%'}}
                />
            </StyleTouchable>

            {/* CORD */}
            <View
                style={[styles.chainLink, {borderColor: theme.borderColor}]}
            />

            {/* Content contain: icon and description */}
            <StyleTouchable
                style={styles.descriptionBox}
                onLayout={({nativeEvent}) =>
                    setFlagSize({
                        width: nativeEvent.layout.width,
                        height: nativeEvent.layout.height,
                    })
                }
                onLongPress={onLongPress}
                delayLongPress={DELAY_LONG_PRESS}
                onPress={editBubble}>
                <Svg width={'100%'} height={'100%'} style={styles.svgView}>
                    <Path
                        d={dPath}
                        stroke={theme.borderColor}
                        strokeWidth={scale(0.5)}
                        fill="none"
                    />
                </Svg>

                <View style={styles.headerView}>
                    <StyleImage
                        source={{uri: icon}}
                        customStyle={styles.iconHobby}
                    />
                    <StyleText
                        originValue={name}
                        customStyle={[
                            styles.textName,
                            {color: theme.textColor},
                        ]}
                        numberOfLines={1}
                    />
                </View>

                <View style={styles.contentBox}>
                    <StyleText
                        originValue={description}
                        customStyle={[styles.text, {color: theme.textColor}]}
                    />
                </View>
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    // choice box
    choiceBox: {
        width: '80%',
        height: '20@vs',
        position: 'absolute',
        top: '-25@vs',
        flexDirection: 'row',
    },
    choiceDelete: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    choiceEdit: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDelete: {
        fontSize: '17@ms',
    },
    iconEdit: {
        fontSize: '20@ms',
    },
    // avatar
    btnCreateView: {
        alignItems: 'center',
    },
    iconCreate: {
        fontSize: '40@ms',
        opacity: 0.6,
    },
    avatarBox: {
        width: '37@s',
        height: '37@s',
        borderRadius: '20@s',
        borderWidth: '1@s',
    },
    chainLink: {
        borderWidth: '0.5@s',
        height: '20@vs',
    },
    // path
    descriptionBox: {
        width: Metrics.width / 3.2,
    },
    svgView: {
        position: 'absolute',
    },
    // header
    headerView: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: '15@s',
        paddingRight: '30@s',
        paddingTop: '10@vs',
        alignItems: 'center',
        overflow: 'hidden',
    },
    iconHobby: {
        width: '17@s',
        height: '17@s',
        borderRadius: '10@s',
        marginRight: '7@s',
    },
    textName: {
        fontSize: '10@ms',
        fontWeight: 'bold',
    },
    // content
    contentBox: {
        width: '100%',
        paddingHorizontal: '15@s',
        paddingVertical: '10@vs',
    },
    text: {
        fontSize: '9@ms',
    },
});

export default BubbleCreate;
