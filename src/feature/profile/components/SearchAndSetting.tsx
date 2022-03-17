import OptionsButton from 'components/common/OptionsButton';
import SearchButton from 'components/common/SearchButton';
import SettingButton from 'components/common/SettingButton';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';

interface Props {
    search: string;
    onSearch: any;
    onShowOptions(): void;
    hasBackBtn?: boolean;
    hasSettingBtn?: boolean;
    onSubmitSearch?(): void;
    onFocus?(): void;
    onBlur?(): void;
    onGoBack?(): void;
}

const SearchAndSetting = (props: Props) => {
    const {
        search,
        onSearch,
        onShowOptions,
        hasBackBtn = true,
        hasSettingBtn = true,
        onSubmitSearch,
        onFocus,
        onBlur,
        onGoBack,
    } = props;
    const {t} = useTranslation();

    return (
        <View style={styles.container}>
            {hasBackBtn && <HeaderLeftIcon onPress={onGoBack || goBack} />}

            {/* Develop search tool later */}
            {false && (
                <SearchButton
                    keyWordSearch={search}
                    setKeyWordSearch={onSearch}
                    placeholder={t('profile.component.searchAndSetting')}
                    onSubmitEditing={onSubmitSearch}
                    customStyle={{marginLeft: hasBackBtn ? 0 : scale(14)}}
                    maxWidthScale={hasBackBtn ? 200 : 170}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            )}

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
    rightBtnView: {
        flexDirection: 'row',
        position: 'absolute',
        right: '20@s',
    },
    settingBtn: {
        marginLeft: '7@s',
    },
});

export default SearchAndSetting;
