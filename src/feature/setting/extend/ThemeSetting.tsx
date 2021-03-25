import ChangeTheme from 'api/actions/setting/ChangeTheme';
import Images from 'asset/img/images';
import {themeType} from 'asset/name';
import Theme from 'asset/theme/Theme';
import {StyleImage} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const {width} = Dimensions.get('screen');

const ThemeSetting = () => {
    const Redux = useRedux();

    const theme = Redux.getTheme();
    const [isPicked, setIsPicked] = useState(
        theme === Theme.darkTheme ? 'dark' : 'light',
    );

    const selectBdColor = (type: string) => {
        return isPicked === type ? theme.highlightColor : theme.holderColor;
    };

    const switchToDarkTheme = async () => {
        setIsPicked('dark');
        // async, redux and server
        await ChangeTheme.changeTheme(themeType.darkTheme);
    };
    const switchToLightTheme = async () => {
        setIsPicked('light');
        // async, redux and sever
        await ChangeTheme.changeTheme(themeType.lightTheme);
    };

    return (
        <View style={styles.container}>
            {/* DARK THEME */}
            <TouchableOpacity
                style={[styles.themeBox, {borderColor: selectBdColor('dark')}]}
                onPress={switchToDarkTheme}>
                <StyleImage
                    source={Images.darkTheme}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>

            {/* LIGHT THEME */}
            <TouchableOpacity
                style={[styles.themeBox, {borderColor: selectBdColor('light')}]}
                onPress={switchToLightTheme}>
                <StyleImage
                    source={Images.lightTheme}
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

export default ThemeSetting;
