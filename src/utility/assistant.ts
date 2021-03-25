/* eslint-disable react-hooks/rules-of-hooks */
import Theme from 'asset/theme/Theme';
import useRedux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {Animated} from 'react-native';

/**
 * FOR CARD STYLE
 */
export const selectBgCardStyle = (theme: any, opacity?: number) => {
    const valueOpacity = opacity || 0.9;
    return theme === Theme.darkTheme
        ? `rgba(8, 16, 25, ${valueOpacity})`
        : `rgba(255, 255, 255, ${valueOpacity})`;
};

/**
 * DISCOVERY PALACE
 */
export const openHeartBox = (setShowTabBar: any) => {
    const modeExp = useRedux().getModeExp();
    if (modeExp) {
        appAlert('alert.clickHeartModeExp');
    } else {
        navigate(DISCOVERY_ROUTE.heartScreen);
        setShowTabBar(false);
    }
};

export const openPlusBox = (setShowTabBar: any) => {
    const modeExp = useRedux().getModeExp();

    if (modeExp) {
        appAlert('alert.clickPlusModeExp');
    } else {
        navigate(DISCOVERY_ROUTE.plusScreen);
        setShowTabBar(false);
    }
};

export const openMessRoute = (
    aim: any,
    isOpeningMess: boolean,
    setIsOpeningMess: any,
    status: boolean,
    setStatus: any,
    setDisableTabBar: any,
) => {
    if (!isOpeningMess) {
        setIsOpeningMess(true);
        setDisableTabBar(true);
        Animated.timing(aim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setStatus(!status));
    } else {
        Animated.timing(aim, {
            toValue: status ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setStatus(!status);
            setDisableTabBar(status ? false : true);
        });
    }
};

/**
 * OTHERS
 */
export const logger = (str: any, params?: any) => {
    const addition = params ? params : '';
    if (__DEV__) {
        console.log(str, addition);
    }
};
