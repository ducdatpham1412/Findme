import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ToolProfile = () => {
    const theme = Redux.getTheme();

    return (
        <View style={styles.buttonActivityBox}>
            <View
                style={[
                    styles.spaceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
            <StyleTouchable
                onPress={() => navigate(PROFILE_ROUTE.createPost)}
                customStyle={styles.touchIconCamera}>
                <FontAwesome5
                    name="camera-retro"
                    style={[styles.iconCamera, {color: theme.textHightLight}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    buttonActivityBox: {
        width: '70%',
        height: '50@vs',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20@vs',
        alignSelf: 'center',
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6,
        borderRadius: '70@vs',
    },
    touchIconCamera: {
        paddingHorizontal: '20@s',
    },
    iconCamera: {
        fontSize: '35@ms',
    },
});

export default ToolProfile;
