// IMPORT COMPONENT BUTTON
import {StyleText} from 'components/base';
import StyleScrollView from 'components/base/StyleScrollView';
import SearchButton from 'components/common/SearchButton';
import useRedux from 'hook/useRedux';
import {useTabBar} from 'navigation/config/TabBarProvider';
//IMPORT MESSAGES SCREEN
import MessRoute from 'navigation/screen/tabs/MessRoute';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, Dimensions, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {openHeartBox, openMessRoute, openPlusBox} from 'utility/assistant';
import HeartButton from './components/HeartButton';
import MessButton from './components/MessButton';
import PlusButton from './components/PlusButton';
import {API_URL} from '@env';

/**
 * MAIN_DISCOVERY WILL DO A MISSION THAT SEARCH
 * AND NAVIGATE TO OTHER CHILD THAT IS HEAR, PLUS
 * MESS IS NOT A NAVIGATION, IT IS A CHILD COMPONENT OF DISCOVERY MAP
 */
const {width} = Dimensions.get('screen');

const DiscoveryScreen: React.FunctionComponent = () => {
    const {setDisableTabBar, setShowTabBar} = useTabBar();
    const {t} = useTranslation();

    const [keyWordSearch, setKeyWordSearch] = useState('');

    /**
     * THIS PART IS FOR OPENING MESSAGES BOX,
     *  isOpeningMess is use for not loading MessScreen when not need,
     *  status to close or open Mess when open
     */
    const [isOpeningMess, setIsOpeningMess] = useState(false);
    const [status, setStatus] = useState(false);

    const aim = useRef(new Animated.Value(0)).current;
    const translateX = aim.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
    });

    const openCloseMess = () => {
        openMessRoute(
            aim,
            isOpeningMess,
            setIsOpeningMess,
            status,
            setStatus,
            setDisableTabBar,
        );
    };

    /**
     * FOR SEARCH BUTTON : SEARCH HOBBY || SEARCH CHAT
     */
    const searchHolder = status
        ? t('discovery.discoveryScreen.searchChat')
        : t('discovery.discoveryScreen.searchHobbies');

    useEffect(() => {
        console.log('Opening Discovery Screen');
    }, []);

    const backgroundColor = useRedux().getTheme().backgroundColor;
    return (
        <View style={[styles.container, {backgroundColor}]}>
            <View style={styles.discoveryPalace}>
                <StyleScrollView>
                    <View style={styles.sky}>
                        <StyleText originValue="Starting point" />
                        <StyleText originValue={API_URL} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                        <View style={styles.bubble} />
                    </View>
                </StyleScrollView>
            </View>

            {/* HEART- FAVORITE TOPIC CHAT */}
            <HeartButton onPress={() => openHeartBox(setShowTabBar)} />

            {/* PLUS - CREATE THE TOPIC OWN */}
            <PlusButton onPress={() => openPlusBox(setShowTabBar)} />

            {/* SEARCH BUTTON */}
            <SearchButton
                keyWordSearch={keyWordSearch}
                setKeyWordSearch={setKeyWordSearch}
                placeholder={searchHolder}
                customStyle={styles.searchButton}
            />

            {/* BUTTON OPEN MESS */}
            <MessButton onPress={openCloseMess} />
            {isOpeningMess && <MessRoute translateX={translateX} />}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    searchButton: {
        position: 'absolute',
        left: '15@s',
        top: '5@vs',
    },
    discoveryPalace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    sky: {
        flex: 1,
        flexDirection: 'column-reverse',
        alignItems: 'center',
        paddingVertical: '150@vs',
    },
    bubble: {
        width: '50@vs',
        height: '50@vs',
        borderRadius: '25@vs',
        backgroundColor: 'orange',
        marginVertical: '50@vs',
    },
});

export default DiscoveryScreen;
