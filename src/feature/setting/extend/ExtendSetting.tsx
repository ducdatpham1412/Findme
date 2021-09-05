import {StyleContainer} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TypeDetailSetting from '../../../components/common/TypeDetailSetting';
import LanguageSetting from './LanguageSetting';
import ThemeSetting from './ThemeSetting';

const ExtendSetting = () => {
    const theme = Redux.getTheme();

    const [isSettingTheme, setIsSettingTheme] = useState(false);
    const openCloseSettingTheme = () => setIsSettingTheme(!isSettingTheme);

    const [isSettingLanguage, setIsSettingLanguage] = useState(false);
    const openCloseSettingLanguage = () =>
        setIsSettingLanguage(!isSettingLanguage);

    return (
        <StyleContainer scrollEnabled containerStyle={styles.container}>
            <TypeDetailSetting
                title="setting.extendSetting.theme"
                onPress={openCloseSettingTheme}
                icon={
                    <Ionicons
                        name="color-palette-outline"
                        style={[styles.stylesIcon, {color: theme.borderColor}]}
                    />
                }
            />
            {isSettingTheme && <ThemeSetting />}

            <TypeDetailSetting
                title="setting.extendSetting.language"
                onPress={openCloseSettingLanguage}
                icon={
                    <FontAwesome
                        name="language"
                        style={[styles.stylesIcon, {color: theme.borderColor}]}
                    />
                }
            />
            {isSettingLanguage && <LanguageSetting />}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '30@s',
    },
    stylesIcon: {
        fontSize: '25@ms',
    },
});

export default ExtendSetting;
