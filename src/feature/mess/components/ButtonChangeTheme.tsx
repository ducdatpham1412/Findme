import {TYPE_COLOR} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Platform, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {chooseColorGradient} from 'utility/assistant';

interface Props {
    colorNow: number;
    onChangeChatTheme(newColor: number): void;
}

const ButtonChangeTheme = (props: Props) => {
    const {colorNow, onChangeChatTheme} = props;
    const {gradient} = Redux.getResource();

    const [isChanging, setIsChanging] = useState(false);
    const [showGradient, setShowGradient] = useState(true);
    const aim = useRef(new Animated.Value(0)).current;
    const degree = aim.interpolate({
        inputRange: [0, 1],
        outputRange: ['45deg', '0deg'],
    });

    const [size, setSize] = useState(scale(70));

    const chatColor = useMemo(() => {
        return chooseColorGradient({
            listGradients: gradient,
            colorChoose: colorNow,
        });
    }, [colorNow]);
    const listGradientColor = useMemo(() => {
        const temp = [];
        const type_color: any = TYPE_COLOR;
        for (const [key, value] of Object.entries(gradient)) {
            temp.push({
                id: type_color[key],
                value,
            });
        }
        return temp;
    }, []);

    const openChanging = useCallback(() => {
        Animated.timing(aim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setSize(Metrics.width - 100);
            setShowGradient(false);
        });
    }, []);

    const closeChanging = useCallback(() => {
        setShowGradient(true);
        setSize(scale(70));
        Animated.timing(aim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (isChanging) {
            openChanging();
        } else {
            closeChanging();
        }
    }, [isChanging]);

    /**
     * Render view
     */
    const RenderAnimation = useMemo(() => {
        return (
            <Animated.View
                style={[
                    styles.animatedView,
                    {
                        transform: [{rotate: degree}],
                        borderWidth: isChanging ? moderateScale(1) : 0,
                        borderColor: chatColor[2],
                    },
                ]}>
                {showGradient && (
                    <LinearGradient
                        style={styles.gradientBox}
                        colors={chatColor}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    />
                )}
            </Animated.View>
        );
    }, [isChanging, showGradient]);

    const RenderButton = useMemo(() => {
        if (isChanging) {
            return (
                <Feather
                    name="x"
                    style={[styles.iconClose, {color: chatColor[2]}]}
                />
            );
        }
        return (
            <StyleText
                originValue="Color"
                customStyle={[styles.colorText, {color: Theme.common.white}]}
            />
        );
    }, [isChanging]);

    const RenderListGradient = useMemo(() => {
        if (!showGradient) {
            const renderItem = ({item}: any) => {
                return (
                    <StyleTouchable
                        customStyle={styles.gradientPreviewBox}
                        onPress={() => {
                            onChangeChatTheme(item.id);
                            setIsChanging(false);
                        }}>
                        <LinearGradient
                            style={styles.gradientPreview}
                            colors={item.value}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                        />
                    </StyleTouchable>
                );
            };
            return (
                <StyleList
                    data={listGradientColor}
                    renderItem={renderItem}
                    numColumns={2}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={{alignItems: 'center'}}
                    nestedScrollEnabled
                />
            );
        }
        return null;
    }, [showGradient]);

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                },
            ]}>
            {RenderAnimation}

            <View
                style={[
                    isChanging
                        ? styles.isChangingButton
                        : styles.notChangingButton,
                    {borderBottomColor: chatColor[2]},
                ]}>
                <StyleTouchable onPress={() => setIsChanging(!isChanging)}>
                    {RenderButton}
                </StyleTouchable>
            </View>

            {RenderListGradient}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignSelf: 'center',
        marginTop: '50@vs',
    },
    animatedView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '10@s',
    },
    gradientBox: {
        width: '100%',
        height: '100%',
        borderRadius: '10@s',
    },
    colorText: {
        fontSize: '14@ms',
    },
    notChangingButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    isChangingButton: {
        width: '100%',
        height: '30@vs',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: '10@s',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    iconClose: {
        fontSize: '20@ms',
    },
    gradientPreviewBox: {
        width: '70@vs',
        height: '70@vs',
        alignItems: 'center',
        marginVertical: '10@vs',
        marginHorizontal: '17@s',
    },
    gradientPreview: {
        width: '100%',
        height: '100%',
        borderRadius: '80@s',
    },
});

export default ButtonChangeTheme;
