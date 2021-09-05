import {TypeBubblePalace} from 'api/interface';
import {RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo, useState} from 'react';
import {Image, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Svg, {Path} from 'react-native-svg';
import {interactBubble} from 'utility/assistant';

interface BubbleProps {
    item: TypeBubblePalace;
}

const Bubble = (props: BubbleProps) => {
    const {item} = props;
    const theme = Redux.getTheme();
    const [flagSize, setFlagSize] = useState({
        width: 0,
        height: 0,
    });

    const {icon, description} = item;
    const isMyBubble = item.relationship === RELATIONSHIP.self;

    const dPath = `M0 3 L${flagSize.width} 3 L${flagSize.width - 10} ${
        flagSize.height / 2
    } L${flagSize.width} ${flagSize.height - 3} L0 ${flagSize.height - 3} L10 ${
        flagSize.height / 2
    } L0 3`;

    return (
        <View style={styles.container}>
            {/* BUBBLE */}
            <StyleTouchable
                customStyle={[
                    styles.avatarBox,
                    {
                        borderColor: isMyBubble
                            ? theme.highlightColor
                            : theme.textColor,
                    },
                ]}
                onPress={() => interactBubble(item, true)}>
                <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={styles.avatarCreator}
                    resizeMode="cover"
                />
            </StyleTouchable>

            {/* CORD */}
            <View
                style={[
                    styles.chainLink,
                    {
                        borderColor: isMyBubble
                            ? theme.highlightColor
                            : theme.borderColor,
                    },
                ]}
            />

            {/* DESCRIPTION */}
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
                        stroke={
                            isMyBubble
                                ? theme.highlightColor
                                : theme.borderColor
                        }
                        strokeWidth={1}
                        fill="none"
                    />
                </Svg>

                {/* Icon and Text */}
                <View style={styles.contentBox}>
                    <View style={styles.iconHobbyView}>
                        <StyleIcon
                            source={{
                                uri: icon,
                            }}
                            customStyle={styles.iconHobby}
                            resizeMode="cover"
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
        marginVertical: '20@vs',
    },
    avatarBox: {
        width: '37@s',
        height: '37@s',
        borderRadius: '20@s',
        borderWidth: '1.5@ms',
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
        paddingRight: '5@s',
        height: '100%',
        justifyContent: 'center',
    },
    iconHobby: {
        width: '17@s',
        height: '17@s',
        borderRadius: '10@s',
    },
    textView: {
        flex: 1,
        paddingHorizontal: '5@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: '9@ms',
    },
    avatarCreator: {
        width: '100%',
        height: '100%',
    },
});

export default memo(Bubble);
