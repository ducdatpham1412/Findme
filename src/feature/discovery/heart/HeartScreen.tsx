import {useIsFocused} from '@react-navigation/native';
import {StyleContainer, StyleText} from 'components/base';
import Redux, {HobbyType} from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {goBack} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ComponentHobby from './ComponentHobby';

const HeartScreen = () => {
    const {t} = useTranslation();
    const {setShowTabBar} = useTabBar();
    const isFocused = useIsFocused();
    const theme = Redux.getTheme();
    const resource = Redux.getResource();

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
        const allHobbies = resource.listHobbies;
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
        if (isFocused) {
            getData();
        }
    }, [isFocused]);

    // render_view
    const headerLeftIcon = () => {
        return (
            <AntDesign
                name="close"
                style={[styles.iconHeaderLeft, {color: theme.borderColor}]}
            />
        );
    };

    const TextDone = useMemo(() => {
        return (
            <StyleText
                i18Text="common.save"
                customStyle={[styles.textDone, {color: theme.textColor}]}
            />
        );
    }, []);

    return (
        <>
            <Header
                headerLeft={headerLeftIcon()}
                headerLeftMission={() => {
                    setShowTabBar(true);
                    goBack();
                }}
                headerTitle={t('discovery.heart.headerTitle')}
                headerRight3={TextDone}
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
                            key={item.id}
                            item={item}
                            onPress={() => onClickBubbleHobby(index, true)}
                        />
                    ))}
                </View>

                {/* HOBBIES NOT_LIKED */}
                <View style={styles.otherHobbiesBox}>
                    {notLiked.map((item, index) => (
                        <ComponentHobby
                            key={item.id}
                            item={item}
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
    iconHeaderLeft: {
        fontSize: '20@ms',
    },
    textDone: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
});

export default HeartScreen;
