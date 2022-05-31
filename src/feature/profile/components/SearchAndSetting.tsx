import {GUIDELINE_URL} from 'asset/standardValue';
import {StyleTouchable} from 'components/base';
import OptionsButton from 'components/common/OptionsButton';
import SettingButton from 'components/common/SettingButton';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

interface Props {
    onShowOptions(): void;
    hasGuideButton?: boolean;
    hasBackBtn?: boolean;
    hasSettingBtn?: boolean;
    onGoBack?(): void;
}

const SearchAndSetting = (props: Props) => {
    const {
        onShowOptions,
        hasGuideButton = false,
        hasBackBtn = true,
        hasSettingBtn = true,
        onGoBack,
    } = props;
    const theme = Redux.getTheme();

    const onGoToUserGuide = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.userGuide.title',
            linkWeb: GUIDELINE_URL,
        });
    };

    return (
        <View style={styles.container}>
            {hasBackBtn && <HeaderLeftIcon onPress={onGoBack || goBack} />}

            <View style={styles.leftBtnView}>
                {hasGuideButton && (
                    <StyleTouchable
                        customStyle={[
                            styles.buttonBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={onGoToUserGuide}>
                        <SimpleLineIcons
                            name="book-open"
                            style={{
                                fontSize: moderateScale(16),
                                color: theme.textHightLight,
                            }}
                        />
                    </StyleTouchable>
                )}
            </View>

            <View style={styles.rightBtnView}>
                <OptionsButton onPress={onShowOptions} />

                {hasSettingBtn && (
                    <SettingButton
                        onPress={() => navigate(PROFILE_ROUTE.settingRoute)}
                        customStyle={styles.settingBtn}
                    />
                )}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '50@vs',
        alignItems: 'center',
        flexDirection: 'row',
    },
    leftBtnView: {
        flexDirection: 'row',
        position: 'absolute',
        left: '20@s',
    },
    rightBtnView: {
        flexDirection: 'row',
        position: 'absolute',
        right: '20@s',
    },
    settingBtn: {
        marginLeft: '7@s',
    },
    buttonBox: {
        width: '33@vs',
        height: '33@vs',
        borderRadius: '20@s',
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchAndSetting;
