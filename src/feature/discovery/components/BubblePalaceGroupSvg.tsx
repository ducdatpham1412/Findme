import {TypeCreateGroupResponse} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {View} from 'react-native';
import {
    moderateScale,
    scale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import {Path, Svg} from 'react-native-svg';
import IconHobby from './IconHobby';

interface Props {
    item: TypeCreateGroupResponse;
}

const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const BubblePalaceGroupSvg = (props: Props) => {
    const {item} = props;

    const theme = Redux.getTheme();

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const BALLON_AIR_PATH = `M 0 0 L ${x} 0 C ${x - 50} ${y / 2} ${x - 50} ${
        y / 2
    } ${x} ${y} L 0 ${y} C 50 ${y / 2} 50 ${y / 2} 0 0 Z`;

    const image = item.images[0];

    return (
        <View style={styles.container}>
            <View style={[styles.imageBox, {borderColor: theme.borderColor}]}>
                <StyleImage
                    source={{
                        uri: image,
                    }}
                    customStyle={styles.image}
                />
            </View>

            <View style={[styles.cord, {backgroundColor: theme.borderColor}]} />

            <View
                style={styles.textView}
                onLayout={e => {
                    setX(e.nativeEvent.layout.width);
                    setY(e.nativeEvent.layout.height);
                }}>
                <Svg style={styles.svgBox}>
                    <Path
                        d={BALLON_AIR_PATH}
                        stroke={theme.borderColor}
                        strokeWidth={moderateScale(1)}
                    />
                </Svg>

                <View style={styles.iconHobbyBox}>
                    <IconHobby
                        color={item.color}
                        onTouchStart={() => null}
                        onTouchEnd={() => null}
                        containerStyle={{marginTop: 0}}
                    />
                </View>

                <View style={styles.contentBox}>
                    <StyleText
                        originValue={'Mùa vụ cà rốt của tôi'}
                        customStyle={[
                            styles.inputContainer,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: bubbleHeight,
        alignItems: 'center',
    },
    imageBox: {
        width: Metrics.width - scale(50),
        height: Metrics.width - scale(50),
        borderRadius: '300@s',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '1@ms',
        marginTop: Metrics.safeTopPadding + verticalScale(60),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cord: {
        width: '2@ms',
        height: '50@vs',
    },
    textView: {
        width: Metrics.width * 0.6 + scale(100),
        minHeight: '100@vs',
        maxHeight: '160@vs',
        flexDirection: 'row',
    },
    svgBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    iconHobbyBox: {
        height: '100%',
        paddingLeft: 50,
        paddingRight: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
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
        paddingRight: 50,
        paddingVertical: '10@vs',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '100%',
    },
});

export default BubblePalaceGroupSvg;
