import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, {Path} from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Metrics} from 'asset/metrics';
import {TypeMyBubbles} from 'api/interface';

interface BubbleProps {
    item: TypeMyBubbles;
    containerStyle?: StyleProp<ViewStyle>;
    // for bubble in create
    showCreateBubble?: boolean;
    editBubble: any;
    deleteBubble: any;
}

/**
 * BUTTON CREATE IF ITEM NOT DEFINED
 */
const BtnCreateBubble = ({editBubble}: any) => {
    const theme = Redux.getTheme();

    return (
        <StyleTouchable customStyle={styles.btnCreateView} onPress={editBubble}>
            <Ionicons
                name="create-outline"
                style={[styles.iconCreate, {color: theme.borderColor}]}
            />
        </StyleTouchable>
    );
};

/**
 * BOSS HERE
 * */
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
        return <BtnCreateBubble editBubble={editBubble} />;
    }

    // if bubbles is defined, return Bubbles
    const {icon, description} = item;
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
            {/* CHOICE DELETE OR EDIT BUBBLE */}
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

            {/* BUBBLE */}
            <StyleTouchable
                customStyle={[
                    styles.avatarBox,
                    {borderColor: theme.highlightColor},
                ]}
                onLongPress={onLongPress}
                onPress={editBubble}>
                <StyleImage
                    source={{uri: item.privateAvatar}}
                    customStyle={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                />
            </StyleTouchable>

            {/* CORD */}
            <View
                style={[styles.chainLink, {borderColor: theme.borderColor}]}
            />

            {/* DESCRIPTION CONTAIN: ICON AND DESCRIPTION */}
            <View
                style={styles.descriptionBox}
                onLayout={({nativeEvent}) =>
                    setFlagSize({
                        width: nativeEvent.layout.width,
                        height: nativeEvent.layout.height,
                    })
                }>
                <Svg width={'100%'} height={'100%'} style={styles.svgView}>
                    <Path
                        d={dPath}
                        stroke={theme.borderColor}
                        strokeWidth={1}
                        fill="none"
                    />
                </Svg>

                <View style={styles.contentBox}>
                    <View style={styles.iconHobbyView}>
                        <StyleIcon
                            source={{uri: icon}}
                            size={17}
                            customStyle={{borderRadius: 100}}
                        />
                    </View>
                    <View style={styles.textView}>
                        <StyleText
                            originValue={description}
                            customStyle={[
                                styles.text,
                                {color: theme.textColor},
                            ]}
                        />
                    </View>
                </View>
            </View>
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
        borderRadius: '20@vs',
        borderWidth: 1,
    },
    chainLink: {
        borderWidth: 0.5,
        height: '20@vs',
    },
    // path
    descriptionBox: {
        width: Metrics.width / 3.2,
        minHeight: '50@vs',
    },
    svgView: {
        position: 'absolute',
    },
    // content
    contentBox: {
        flex: 1,
        paddingHorizontal: 15,
        flexDirection: 'row',
    },
    iconHobbyView: {
        height: '100%',
        justifyContent: 'center',
        paddingRight: '5@s',
    },
    textView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: '9@ms',
    },
});

export default BubbleCreate;
