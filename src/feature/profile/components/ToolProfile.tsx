import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {Platform, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    index: number;
    onChangeTab(index: number): void;
}

const unFocusOpacity = 0.3;

const ToolProfile = (props: Props) => {
    const {index, onChangeTab} = props;
    const theme = Redux.getTheme();

    const isInMyPosts = index === 0;
    const isPostsLiked = index === 1;
    const isPostsSaved = index === 2;

    return (
        <View style={[styles.container, {borderTopColor: theme.borderColor}]}>
            <View
                style={[
                    styles.spaceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
            <View style={styles.buttonBox}>
                <StyleTouchable onPress={() => onChangeTab(0)} hitSlop={15}>
                    <Entypo
                        name="list"
                        style={[
                            styles.icon,
                            {
                                color: theme.textHightLight,
                                opacity: isInMyPosts ? 1 : unFocusOpacity,
                            },
                        ]}
                    />
                </StyleTouchable>
            </View>

            <View
                style={[
                    styles.dividerBetween,
                    {borderRightColor: theme.borderColor},
                ]}
            />

            <View style={styles.buttonBox}>
                <StyleTouchable onPress={() => onChangeTab(1)} hitSlop={15}>
                    <Entypo
                        name="heart-outlined"
                        style={[
                            styles.icon,
                            {
                                color: theme.textHightLight,
                                opacity: isPostsLiked ? 1 : unFocusOpacity,
                            },
                        ]}
                    />
                </StyleTouchable>
            </View>

            <View
                style={[
                    styles.dividerBetween,
                    {borderRightColor: theme.borderColor},
                ]}
            />

            <View style={styles.buttonBox}>
                <StyleTouchable onPress={() => onChangeTab(2)} hitSlop={15}>
                    <Feather
                        name="bookmark"
                        style={[
                            styles.iconBookMark,
                            {
                                color: theme.textHightLight,
                                opacity: isPostsSaved ? 1 : unFocusOpacity,
                            },
                        ]}
                    />
                </StyleTouchable>
            </View>
        </View>
    );
};

export const toolProfileHeight = moderateScale(30);
const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: toolProfileHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: Platform.select({
            ios: '0.4@ms',
            android: '1@ms',
        }),
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.95,
    },
    buttonBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '20@ms',
    },
    iconBookMark: {
        fontSize: '18@ms',
    },
    dividerBetween: {
        height: '70%',
        borderRightWidth: Platform.select({
            ios: '0.4@ms',
            android: '1@ms',
        }),
    },
});

export default ToolProfile;
