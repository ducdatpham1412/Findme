import {Metrics} from 'asset/metrics';
import {StyleContainer} from 'components/base';
import SearchButton from 'components/common/SearchButton';
import Redux from 'hook/useRedux';
import {useTabBar} from 'navigation/config/TabBarProvider';
import MessRoute from 'navigation/screen/tabs/MessRoute';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, Keyboard, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {openHeartBox, openMessRoute, openPlusBox} from 'utility/assistant';
import Bubble from './components/Bubble';
import BubblePushFrame from './components/BubblePushFrame';
import HeartButton from './components/HeartButton';
import MessButton from './components/MessButton';
import PlusButton from './components/PlusButton';

/**
 * Discovery can navigate to other child screen like HeartScree, PlusScreen
 * MESS is not a navigation, it is a child component inside this screen
 */

const DiscoveryScreen: React.FunctionComponent = () => {
    const {setDisableTabBar, setShowTabBar} = useTabBar();
    const {t} = useTranslation();

    const [keyWordSearch, setKeyWordSearch] = useState('');
    const bubbles = Redux.getBubblePalace();

    /**
     * THIS PART IS FOR OPENING MESSAGES BOX
     *  status to close or open Mess when open
     */
    // const [isOpeningMess, setIsOpeningMess] = useState(false);
    const [status, setStatus] = useState(false);

    const aim = useRef(new Animated.Value(0)).current;
    const translateX = aim.interpolate({
        inputRange: [0, 1],
        outputRange: [Metrics.width, 0],
    });

    const openCloseMess = () => {
        openMessRoute(
            aim,
            // isOpeningMess,
            // setIsOpeningMess,
            status,
            setStatus,
            setDisableTabBar,
        );
        Keyboard.dismiss();
    };

    // FOR SEARCH BUTTON : SEARCH HOBBY || SEARCH CHAT
    const searchHolder = status
        ? t('discovery.discoveryScreen.searchChat')
        : t('discovery.discoveryScreen.searchHobbies');

    useEffect(() => {
        console.log(bubbles);
    }, [bubbles]);

    return (
        <View style={styles.container}>
            {/* BUBBLES PALACE */}
            <StyleContainer
                scrollEnabled
                containerStyle={styles.discoveryPalace}>
                <View style={styles.sky}>
                    {bubbles.map(item => (
                        <Bubble key={item.id} item={item} />
                    ))}
                </View>
            </StyleContainer>

            {/* BUBBLES PUSH FRAME */}
            <BubblePushFrame />

            {/* HEART- FAVORITE TOPIC CHAT */}
            <HeartButton onPress={() => openHeartBox(setShowTabBar)} />

            {/* PLUS - CREATE THE TOPIC OWN */}
            <PlusButton onPress={() => openPlusBox(setShowTabBar)} />

            {/* SEARCH BUTTON */}
            {status && (
                <SearchButton
                    keyWordSearch={keyWordSearch}
                    setKeyWordSearch={setKeyWordSearch}
                    placeholder={searchHolder}
                    customStyle={styles.searchButton}
                />
            )}

            {/* BUTTON OPEN MESS */}
            <MessButton onPress={openCloseMess} />
            <MessRoute translateX={translateX} />
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
});

export default DiscoveryScreen;
