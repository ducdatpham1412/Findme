import ChangeLanguage from 'api/actions/setting/ChangeLanguage';
import Images from 'asset/img/images';
import {languageType} from 'asset/name';
import {StyleImage} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const {width} = Dimensions.get('screen');

const LanguageSetting = () => {
    const Redux = useRedux();

    const theme = Redux.getTheme();
    const {i18n} = useTranslation();

    const [isPicked, setIsPicked] = useState(
        i18n.language === languageType.en ? languageType.en : languageType.vi,
    );
    const selectBorderColor = (lan: string) =>
        isPicked === lan ? theme.highlightColor : theme.holderColor;

    const switchToEnglish = async () => {
        setIsPicked(languageType.en);
        // async and server
        await ChangeLanguage.changeLanguage(languageType.en);
    };
    const switchToVietnamese = async () => {
        setIsPicked(languageType.vi);
        // async and sever
        await ChangeLanguage.changeLanguage(languageType.vi);
    };

    return (
        <View style={styles.container}>
            {/* ENGLISH */}
            <TouchableOpacity
                style={[
                    styles.themeBox,
                    {borderColor: selectBorderColor(languageType.en)},
                ]}
                onPress={switchToEnglish}>
                <StyleImage
                    source={Images.english}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>

            {/* VIETNAMESE */}
            <TouchableOpacity
                style={[
                    styles.themeBox,
                    {borderColor: selectBorderColor(languageType.vi)},
                ]}
                onPress={switchToVietnamese}>
                <StyleImage
                    source={Images.vietnamese}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '90%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    themeBox: {
        width: width / 3,
        height: width / 3.4,
        borderWidth: '5@vs',
        borderRadius: '20@vs',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeImage: {
        width: '100%',
    },
});

export default LanguageSetting;
