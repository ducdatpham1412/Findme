import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    index: number;
    onChangeTab(index: number): void;
    disableReview: boolean;
    onShowModalReview(): void;
}

const unFocusOpacity = 0.3;

const ToolOtherProfile = (props: Props) => {
    const {index, onChangeTab, disableReview, onShowModalReview} = props;
    const theme = Redux.getTheme();

    const isInListPosts = index === 0;
    const isPostReview = index === 1;

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
                            opacity: isInListPosts ? 1 : unFocusOpacity,
                        },
                    ]}
                />
            </StyleTouchable>

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={() => onChangeTab(1)}>
                <Feather
                    name="tag"
                    style={[
                        styles.iconTag,
                        {
                            color: theme.textHightLight,
                            opacity: isPostReview ? 1 : unFocusOpacity,
                        },
                    ]}
                />
            </StyleTouchable>

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={onShowModalReview}
                disable={disableReview}>
                <Feather
                    name="plus-square"
                    style={[
                        styles.iconTag,
                        {
                            color: theme.textColor,
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
    iconTag: {
        fontSize: '18@ms',
    },
});

export default ToolOtherProfile;
