import {useIsFocused} from '@react-navigation/native';
import {listHobbies} from 'asset/staticData';
import {StyleContainer} from 'components/base';
import useRedux from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {goBack} from 'navigation/NavigationService';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import TextDone from '../components/TextDone';
import ComponentHobby, {HobbyType} from './ComponentHobby';

const HeartScreen = () => {
    const theme = useRedux().getTheme();
    const {t} = useTranslation();
    const {setShowTabBar} = useTabBar();
    const isFocused = useIsFocused();

    const [liked, setLiked] = useState<Array<HobbyType>>([]);
    const [notLiked, setNotLiked] = useState<Array<HobbyType>>([]);

    const onClickDone = async () => {
        setShowTabBar(true);
        goBack();
        // set to State and Server.....
    };

    const onClickBubbleHobby = (index: number, isInLiked: boolean) => {
        if (!isInLiked) {
            const tempNotLiked = [...notLiked];
            tempNotLiked.splice(index, 1);
            const tempLiked = [...liked, notLiked[index]];
            setLiked(tempLiked);
            setNotLiked(tempNotLiked);
        } else {
            const tempLiked = [...liked];
            tempLiked.splice(index, 1);
            const tempNotLiked = [...notLiked, liked[index]];
            setLiked(tempLiked);
            setNotLiked(tempNotLiked);
        }
    };

    const getData = () => {
        const allHobbies: Array<HobbyType> = listHobbies;
        const tempLiked: any = [];
        const tempNotLiked: any = [];

        allHobbies.forEach(item => {
            if (item.liked) {
                tempLiked.push(item);
            } else {
                tempNotLiked.push(item);
            }
        });

        setLiked(tempLiked);
        setNotLiked(tempNotLiked);
    };

    useEffect(() => {
        getData();
    }, [isFocused]);

    return (
        <>
            <Header
                headerLeftMission={onClickDone}
                headerTitle={t('discovery.heart.headerTitle')}
                headerRight3={<TextDone />}
                headerRight3Mission={onClickDone}
            />
            <StyleContainer
                containerStyle={styles.container}
                scrollEnabled
                isEffectTabBar={false}>
                {/* HOBBIES LIKE */}
                <View
                    style={[
                        styles.likedHobbiesBox,
                        {borderBottomColor: theme.textColor},
                    ]}>
                    {liked.map((item, index) => (
                        <ComponentHobby
                            key={index}
                            name={item.name}
                            icon={item.icon}
                            liked
                            onPress={() => onClickBubbleHobby(index, true)}
                        />
                    ))}
                </View>

                {/* HOBBIES NOT_LIKED */}
                <View style={styles.otherHobbiesBox}>
                    {notLiked.map((item, index) => (
                        <ComponentHobby
                            key={index}
                            name={item.name}
                            icon={item.icon}
                            liked={false}
                            onPress={() => onClickBubbleHobby(index, false)}
                        />
                    ))}
                </View>
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    likedHobbiesBox: {
        width: '100%',
        minHeight: '50@vs',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBottom: '100@vs',
    },
    otherHobbiesBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: '10@vs',
    },
});

export default HeartScreen;
