// import {TypeBubblePalace} from 'api/interface';
// import {RELATIONSHIP, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
// import {Metrics} from 'asset/metrics';
// import {TIMING_BUBBLE_FLY} from 'asset/standardValue';
// import {StyleImage, StyleText, StyleTouchable} from 'components/base';
// import Redux from 'hook/useRedux';
// import {appAlert} from 'navigation/NavigationService';
// import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
// import {useTranslation} from 'react-i18next';
// import {Animated, View} from 'react-native';
// import {scale, ScaledSheet} from 'react-native-size-matters';
// import Svg, {Path} from 'react-native-svg';
// import {interactBubble, onGoToSignUp} from 'utility/assistant';

// interface BubbleProps {
//     item: TypeBubblePalace;
// }

// const {width, height} = Metrics;
// /**
//  * Equation:
//  * 1. x = a1 * y^2 + b1 * y
//  * 2. x = a2 * y^2 + b2 * y
//  * 3. x = 0
//  */
// const a1 = width / (3 * Math.pow(height, 2));
// const b1 = (2 * width) / (3 * height);
// const a2 = -width / (3 * Math.pow(height, 2));
// const b2 = (-2 * width) / (3 * height);

// const Bubble = (props: BubbleProps) => {
//     const {item} = props;
//     const {t} = useTranslation();
//     const theme = Redux.getTheme();

//     const [flagSize, setFlagSize] = useState({
//         width: 0,
//         height: 0,
//     });

//     const {icon, description, name} = item;
//     const isMyBubble = item.relationship === RELATIONSHIP.self;

//     const dPath = `M0 3 L${flagSize.width} 3 L${flagSize.width - 10} ${
//         flagSize.height / 2
//     } L${flagSize.width} ${flagSize.height - 3} L0 ${flagSize.height - 3} L10 ${
//         flagSize.height / 2
//     } L0 3`;

//     const opacity = item?.canNotInteract ? 0.6 : 1;
//     const opacityBubble = useMemo(() => {
//         if (item?.canNotInteract) {
//             return 0.6;
//         }
//         if (isMyBubble) {
//             return 1;
//         }
//         return 1;
//     }, [item.canNotInteract, isMyBubble]);

//     /**
//      * For moving bubble
//      */
//     const aim = useRef(new Animated.Value(0)).current;
//     const translateX = useRef(new Animated.Value(0)).current;
//     const translateY = aim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, -2 * height],
//     });

//     const choose = useMemo(() => Math.floor(Math.random() * 3), []);
//     translateY.removeAllListeners();
//     if (choose === 0) {
//         translateY.addListener(({value}) => {
//             translateX.setValue(a1 * Math.pow(value, 2) + b1 * value);
//         });
//     } else if (choose === 1) {
//     } else if (choose === 2) {
//         translateY.addListener(({value}) =>
//             translateX.setValue(a2 * Math.pow(value, 2) + b2 * value),
//         );
//     }

//     const moving = () => {
//         Animated.timing(aim, {
//             toValue: 1,
//             duration: TIMING_BUBBLE_FLY,
//             useNativeDriver: true,
//         }).start(() => {
//             Redux.setBubblePalaceAction({
//                 action: TYPE_BUBBLE_PALACE_ACTION.removeOne,
//                 payload: item.id,
//             });
//         });
//     };

//     useEffect(() => {
//         moving();
//     }, []);

//     const onInteractBubble = () => {
//         if (item?.canNotInteract) {
//             appAlert(t('discovery.interactBubble.thisIsUserHadAccount'), {
//                 moreNotice: 'profile.component.infoProfile.tellSignUp',
//                 moreAction: onGoToSignUp,
//             });
//         } else {
//             interactBubble({
//                 itemBubble: item,
//                 isBubble: true,
//                 havingOption: true,
//             });
//         }
//     };

//     return (
//         <Animated.View
//             style={[
//                 styles.container,
//                 {
//                     transform: [{translateY}, {translateX}],
//                     opacity,
//                 },
//             ]}>
//             {/* Bubble */}
//             <StyleTouchable
//                 customStyle={[
//                     styles.avatarBox,
//                     {
//                         borderColor: isMyBubble
//                             ? theme.highlightColor
//                             : theme.textColor,
//                     },
//                 ]}
//                 onPress={onInteractBubble}
//                 normalOpacity={opacityBubble}>
//                 <StyleImage
//                     source={{uri: item.creatorAvatar}}
//                     customStyle={styles.avatarCreator}
//                 />
//             </StyleTouchable>

//             {/* Cord */}
//             <View
//                 style={[
//                     styles.chainLink,
//                     {
//                         borderColor: isMyBubble
//                             ? theme.highlightColor
//                             : theme.borderColor,
//                     },
//                 ]}
//             />

//             {/* Description */}
//             <StyleTouchable
//                 style={styles.descriptionBox}
//                 onLayout={({nativeEvent}) =>
//                     setFlagSize({
//                         width: nativeEvent.layout.width,
//                         height: nativeEvent.layout.height,
//                     })
//                 }
//                 onPress={onInteractBubble}>
//                 <Svg width={'100%'} height={'100%'} style={styles.svgView}>
//                     <Path
//                         d={dPath}
//                         stroke={
//                             isMyBubble
//                                 ? theme.highlightColor
//                                 : theme.borderColor
//                         }
//                         strokeWidth={scale(0.5)}
//                         fill="none"
//                     />
//                 </Svg>

//                 <View style={styles.headerView}>
//                     <StyleImage
//                         source={{uri: icon}}
//                         customStyle={styles.iconHobby}
//                     />
//                     <StyleText
//                         originValue={name}
//                         customStyle={[
//                             styles.textName,
//                             {color: theme.textColor},
//                         ]}
//                         numberOfLines={1}
//                     />
//                 </View>

//                 <View style={styles.contentBox}>
//                     <StyleText
//                         originValue={description}
//                         customStyle={[styles.text, {color: theme.textColor}]}
//                     />
//                 </View>
//             </StyleTouchable>
//         </Animated.View>
//     );
// };

// const bubbleWidth = Metrics.width / 3.2;

// const styles = ScaledSheet.create({
//     container: {
//         alignItems: 'center',
//         position: 'absolute',
//         bottom: 0,
//         left: width / 2 - bubbleWidth / 2,
//     },
//     avatarBox: {
//         width: '37@s',
//         height: '37@s',
//         borderRadius: '20@s',
//         borderWidth: '1.5@ms',
//     },
//     chainLink: {
//         borderWidth: '0.5@s',
//         height: '20@vs',
//     },
//     avatarCreator: {
//         width: '100%',
//         height: '100%',
//     },
//     // path
//     descriptionBox: {
//         width: bubbleWidth,
//     },
//     svgView: {
//         position: 'absolute',
//     },
//     // header
//     headerView: {
//         width: '100%',
//         flexDirection: 'row',
//         paddingLeft: '15@s',
//         paddingRight: '30@s',
//         paddingTop: '10@vs',
//         alignItems: 'center',
//         overflow: 'hidden',
//     },
//     iconHobby: {
//         width: '17@s',
//         height: '17@s',
//         borderRadius: '10@s',
//         marginRight: '7@s',
//     },
//     textName: {
//         fontSize: '10@ms',
//         fontWeight: 'bold',
//     },
//     // content
//     contentBox: {
//         width: '100%',
//         paddingHorizontal: '15@s',
//         paddingVertical: '10@vs',
//     },
//     text: {
//         fontSize: '9@ms',
//     },
// });

// export default memo(Bubble, (prevProps: BubbleProps, nextProps: any) => {
//     Object.entries(prevProps.item).forEach(item => {
//         const [key, value] = item;
//         if (nextProps.item?.[key] !== value) {
//             return false;
//         }
//     });

//     return true;
// });
