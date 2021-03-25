import {StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BubbleProps {
    item: any;
    showCreateBubble: boolean;
    setShowCreateBubble: any;
}
/**
 * BUTTON CREATE IF ITEM NOT DEFINED
 */
const BtnCreateBubble = ({showCreateBubble, setShowCreateBubble}: any) => {
    const theme = useRedux().getTheme();

    return (
        <StyleTouchable
            customStyle={styles.btnCreateView}
            onPress={() => setShowCreateBubble(!showCreateBubble)}>
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
const Bubble = (props: BubbleProps) => {
    const theme = useRedux().getTheme();

    if (!props.item) {
        return (
            <BtnCreateBubble
                showCreateBubble={props.showCreateBubble}
                setShowCreateBubble={props.setShowCreateBubble}
            />
        );
    }

    const {idHobby, description} = props.item;

    return (
        <View style={styles.container}>
            {/* BUBBLE */}
            <StyleTouchable
                customStyle={[
                    styles.avatarBox,
                    {borderColor: theme.highlightColor},
                ]}
            />

            {/* CORD */}
            <View
                style={[styles.chainLink, {borderColor: theme.borderColor}]}
            />

            {/* DESCRIPTION CONTAIN: ICON AND DESCRIPTION */}
            <View style={[styles.desBox, {borderColor: theme.borderColor}]}>
                <View style={styles.iconHobbyView}>
                    <StyleText originValue={idHobby} />
                </View>

                <View style={styles.textView}>
                    <StyleText
                        originValue={description}
                        customStyle={[styles.text, {color: theme.textColor}]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    btnCreateView: {
        alignItems: 'center',
    },
    iconCreate: {
        fontSize: '40@ms',
        opacity: 0.6,
    },
    avatarBox: {
        width: '50@vs',
        height: '50@vs',
        borderRadius: '50@vs',
        borderWidth: 1,
    },
    chainLink: {
        borderWidth: 0.5,
        height: '20@vs',
    },
    desBox: {
        width: '130@vs',
        maxHeight: '60@vs',
        borderRadius: '30@vs',
        borderWidth: 1,
        paddingVertical: '10@vs',
        flexDirection: 'row',
    },
    iconHobbyView: {
        paddingHorizontal: '15@s',
        height: '100%',
        justifyContent: 'center',
    },
    textView: {
        flex: 1,
        paddingRight: '15@s',
    },
    text: {
        fontSize: '12@ms',
    },
});

export default Bubble;
