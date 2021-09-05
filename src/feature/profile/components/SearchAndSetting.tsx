import OptionsButton from 'components/common/OptionsButton';
import SearchButton from 'components/common/SearchButton';
import SettingButton from 'components/common/SettingButton';
import Redux from 'hook/useRedux';
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
}

const SearchAndSetting = (props: Props) => {
    const {
        search,
        onSearch,
        onShowOptions,
        hasBackBtn = true,
        hasSettingBtn = true,
        onSubmitSearch,
    } = props;
    const {t} = useTranslation();
    const {backgroundColor} = Redux.getTheme();

    return (
        <View style={[styles.container, {backgroundColor}]}>
            {hasBackBtn && <HeaderLeftIcon onPress={goBack} />}

            <SearchButton
                keyWordSearch={search}
                setKeyWordSearch={onSearch}
                placeholder={t('profile.component.searchAndSetting')}
                onSubmitEditing={onSubmitSearch}
                customStyle={{marginLeft: hasBackBtn ? 0 : scale(14)}}
                maxWidthScale={hasBackBtn ? 200 : 170}
            />

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
        width: '100%',
        height: '50@vs',
        // paddingHorizontal: '15@s',
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
