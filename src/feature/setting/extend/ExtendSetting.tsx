import {typeDetailSetting} from 'asset/name';
import {StyleContainer} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ScaledSheet} from 'react-native-size-matters';
import TypeDetailSetting from '../components/TypeDetailSetting';
import LanguageSetting from './LanguageSetting';
import ThemeSetting from './ThemeSetting';

const ExtendSetting = () => {
    const Redux = useRedux();

    const theme = Redux.getTheme();

    const [isSettingTheme, setIsSettingTheme] = useState(false);
    const openCloseSettingTheme = () => setIsSettingTheme(!isSettingTheme);

    const [isSettingLanguage, setIsSettingLanguage] = useState(false);
    const openCloseSettingLanguage = () =>
        setIsSettingLanguage(!isSettingLanguage);

    return (
        <StyleContainer scrollEnabled containerStyle={styles.container}>
            <TypeDetailSetting
                type={typeDetailSetting.theme}
                onPress={openCloseSettingTheme}
            />
            {isSettingTheme && <ThemeSetting />}

            <TypeDetailSetting
                type={typeDetailSetting.language}
                onPress={openCloseSettingLanguage}
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
});

export default ExtendSetting;
