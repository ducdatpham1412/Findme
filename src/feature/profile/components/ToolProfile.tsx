import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
                onPress={() => navigate(PROFILE_ROUTE.createPostPreview)}
                customStyle={[
                    styles.touchIconCamera,
                    {borderColor: theme.textColor},
                ]}>
                <Feather
                    name="instagram"
                    style={[styles.iconCamera, {color: theme.textHightLight}]}
                />
            </StyleTouchable>

            <View
                style={[
                    styles.dividerBetween,
                    {borderColor: theme.borderColor},
                ]}
            />

            <StyleTouchable
                onPress={() => navigate(PROFILE_ROUTE.createGroup)}
                customStyle={[
                    styles.touchIconCamera,
                    {borderColor: theme.textColor},
                ]}>
                <MaterialIcons
                    name="groups"
                    style={[styles.iconCamera, {color: theme.textHightLight}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    buttonActivityBox: {
        width: '70%',
        height: '50@ms',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20@vs',
        marginBottom: '10@vs',
        alignSelf: 'center',
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.8,
        borderRadius: '70@vs',
    },
    touchIconCamera: {
        padding: '10@ms',
        borderWidth: '0@ms',
        borderRadius: '30@ms',
        marginHorizontal: '10%',
    },
    iconCamera: {
        fontSize: '25@ms',
    },
    dividerBetween: {
        height: '70%',
        borderWidth: '1@ms',
    },
});

export default ToolProfile;
