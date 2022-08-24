import {TypeCreateGroupResponse} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Redux from 'hook/useRedux';
import React, {useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {Path, Svg} from 'react-native-svg';
import {
    chooseIconHobby,
    modalizeGoToChatTagFromGroup,
    modalizeOptionBubbleGroup,
} from 'utility/assistant';

interface Props {
    item: TypeCreateGroupResponse;
    onDeleteAGroupFromList(bubbleId: string): void;
}

const bubbleSize = Metrics.width / 3.5;

const BubbleGroup = (props: Props) => {
    const {item, onDeleteAGroupFromList} = props;

    const theme = Redux.getTheme();

    const modalBubbleRef = useRef<any>(null);
    const modalBubbleLongPressRef = useRef<any>(null);

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const SVG_PATH = `M 0 0 L ${x} 0 C ${x - 20} ${y / 2} ${x - 20} ${
        y / 2
    } ${x} ${y} L 0 ${y} C 20 ${y / 2} 20 ${y / 2} 0 0 Z`;

    const iconUrl = useMemo(() => {
        return chooseIconHobby(item.color);
    }, [item.color]);

    const onPress = () => {
        modalBubbleRef.current?.show();
    };

    const onLongPress = () => {
        modalBubbleLongPressRef.current?.show();
    };

    return (
        <>
            <StyleTouchable
                customStyle={styles.container}
                activeOpacity={0.8}
                onPress={onPress}
                onLongPress={onLongPress}>
                <StyleImage
                    source={{uri: item.images[0]}}
                    customStyle={styles.imageBubble}
                />

                <View
                    style={[styles.cord, {backgroundColor: theme.borderColor}]}
                />

                <View
                    style={styles.contentView}
                    onLayout={e => {
                        setX(e.nativeEvent.layout.width);
                        setY(e.nativeEvent.layout.height);
                    }}>
                    <Svg style={styles.svgBox}>
                        <Path
                            d={SVG_PATH}
                            fill={theme.backgroundOpacity(0.7)}
                        />
                    </Svg>
                    <View style={styles.iconBox}>
                        <StyleImage
                            source={{uri: iconUrl}}
                            customStyle={styles.iconHobby}
                        />
                    </View>
                    <View style={styles.contentBox}>
                        <StyleText
                            originValue={item.content}
                            customStyle={[
                                styles.textContent,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                </View>
            </StyleTouchable>

            <StyleActionSheet
                ref={modalBubbleRef}
                listTextAndAction={modalizeGoToChatTagFromGroup({
                    chatTagId: item.chatTagId,
                })}
            />

            <StyleActionSheet
                ref={modalBubbleLongPressRef}
                listTextAndAction={modalizeOptionBubbleGroup({
                    itemGroupFromEdit: item,
                    deleteAGroupFromList: () => onDeleteAGroupFromList(item.id),
                })}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: bubbleSize,
        margin: 20,
        alignItems: 'center',
        overflow: 'visible',
    },
    imageBubble: {
        width: bubbleSize * 0.8,
        height: bubbleSize * 0.8,
        borderRadius: '100@vs',
    },
    cord: {
        width: '2@s',
        height: '20@s',
    },
    contentView: {
        width: '100%',
        flexDirection: 'row',
    },
    iconBox: {
        paddingVertical: '10@vs',
        paddingLeft: 20,
    },
    iconHobby: {
        width: '20@ms',
        height: '20@ms',
    },
    svgBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    contentBox: {
        flex: 1,
        paddingRight: 20,
        paddingLeft: 10,
        justifyContent: 'center',
        maxHeight: '100@vs',
        paddingVertical: '5@vs',
    },
    textContent: {
        fontSize: '10@ms',
    },
});

export default BubbleGroup;
