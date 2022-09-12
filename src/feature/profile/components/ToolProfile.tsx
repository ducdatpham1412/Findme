import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    const isPostArchive = index === 3;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.spaceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
            <StyleTouchable
                onPress={() => onChangeTab(0)}
                customStyle={styles.buttonBox}>
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

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={() => onChangeTab(1)}>
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

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={() => onChangeTab(2)}>
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

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={() => onChangeTab(3)}>
                <Ionicons
                    name="ios-timer-outline"
                    style={[
                        styles.iconArchive,
                        {
                            color: theme.textHightLight,
                            opacity: isPostArchive ? 1 : unFocusOpacity,
                        },
                    ]}
                />
            </StyleTouchable>
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
        borderTopWidth: 0,
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
    iconArchive: {
        fontSize: '20@ms',
    },
});

export default ToolProfile;
