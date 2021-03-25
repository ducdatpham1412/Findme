import SearchButton from 'components/common/SearchButton';
import SettingButton from 'components/common/SettingButton';
import useRedux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const SearchAndSetting = () => {
    const [keyWordSearch, setKeyWordSearch] = useState('');
    const {t} = useTranslation();
    const {backgroundColor} = useRedux().getTheme();

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <SearchButton
                keyWordSearch={keyWordSearch}
                setKeyWordSearch={setKeyWordSearch}
                placeholder={t('profile.component.searchAndSetting')}
                customStyle={styles.searchButton}
            />

            <SettingButton
                onPress={() => navigate(PROFILE_ROUTE.settingRoute)}
                customStyle={styles.settingButton}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '50@vs',
        paddingHorizontal: '15@s',
        justifyContent: 'center',
    },
    searchButton: {
        position: 'absolute',
        left: '15@s',
    },
    settingButton: {
        alignSelf: 'flex-end',
    },
});

export default SearchAndSetting;
