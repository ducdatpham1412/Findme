import {StyleContainer, StyleText, StyleTouchable} from 'components/base';
import StylePicker from 'components/base/picker/StylePicker';
import useRedux from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {goBack} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Bubble from '../components/Bubble';
import TextDone from '../components/TextDone';

const PlusScreen = () => {
    const Redux = useRedux();
    const {t} = useTranslation();
    const {setShowTabBar} = useTabBar();

    const {listBubbles, listHobbies} = Redux.getResource();
    const theme = Redux.getTheme();
    const hobbiesName = listHobbies.map((item: any) => item.name);

    const [showCreateBubble, setShowCreateBubble] = useState(false);

    const [showPickerHobby, setShowPickerHobby] = useState(false);
    const [hobbyChoose, setHobbyChoose] = useState<any>();

    const chooseHobby = (value: string) => {
        const temp = listHobbies.find((item: any) => item.name === value);
        setHobbyChoose(temp);
        setShowPickerHobby(false);
    };

    const onClickDone = async () => {
        setShowTabBar(true);
        goBack();
        // set to State and Server.....
    };

    return (
        <>
            <Header
                headerLeftMission={onClickDone}
                headerTitle={t('discovery.plus.headerTitle')}
                headerRight3={<TextDone />}
                headerRight3Mission={onClickDone}
            />

            <StyleContainer
                customStyle={styles.container}
                scrollEnabled
                isEffectTabBar={false}>
                {/* TWO BUBBLES */}
                <View
                    style={[
                        styles.twoBubblesBox,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    <Bubble
                        item={listBubbles[0]}
                        showCreateBubble={showCreateBubble}
                        setShowCreateBubble={setShowCreateBubble}
                    />
                    <Bubble
                        item={listBubbles[1]}
                        showCreateBubble={showCreateBubble}
                        setShowCreateBubble={setShowCreateBubble}
                    />
                </View>

                {/* BOX CREATE BUBBLE */}
                {showCreateBubble && (
                    // <CreateBubble
                    //     setShowPicker={setShowPickerHobby}
                    //     hobbyChoose={hobbyChoose}
                    // />
                    <View style={styles.boxDescription}>
                        <View style={styles.hobbyBox}>
                            <View
                                style={[
                                    styles.nameHobbyView,
                                    {borderBottomColor: theme.borderColor},
                                ]}>
                                <StyleText
                                    originValue={hobbyChoose?.name || 'Hobby'}
                                    customStyle={[
                                        styles.hobbyText,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </View>
                            <StyleTouchable
                                customStyle={styles.btnPickerView}
                                onPress={() => setShowPickerHobby(true)}>
                                <Entypo
                                    name="round-brush"
                                    style={[
                                        styles.icon,
                                        {color: theme.borderColor},
                                    ]}
                                />
                            </StyleTouchable>
                        </View>

                        <View style={styles.desBox}>
                            <TextInput
                                placeholder="hehehe"
                                placeholderTextColor={theme.holderColor}
                                // multiline
                                style={[
                                    styles.inputDes,
                                    {color: theme.textColor},
                                ]}
                            />
                        </View>
                    </View>
                )}
            </StyleContainer>

            {showPickerHobby && (
                <StylePicker
                    dataList={hobbiesName}
                    mission={chooseHobby}
                    onTouchOut={() => setShowPickerHobby(false)}
                />
            )}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingBottom: '200@vs',
    },
    headerLeft: {
        fontSize: '20@ms',
    },
    twoBubblesBox: {
        width: '100%',
        height: '200@vs',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    boxDescription: {
        width: '100%',
        height: '500@vs',
        alignItems: 'center',
    },
    hobbyBox: {
        width: '70%',
        height: '30@vs',
        marginVertical: '30@vs',
        flexDirection: 'row',
    },
    nameHobbyView: {
        flex: 1,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingBottom: '5@vs',
    },
    btnPickerView: {
        width: '60@s',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hobbyText: {
        fontSize: '20@ms',
    },
    icon: {
        fontSize: '20@ms',
    },
    desBox: {
        width: '80%',
        paddingVertical: '8@vs',
        paddingHorizontal: '15@s',
        borderWidth: 1,
        borderColor: 'orange',
        borderRadius: '15@vs',
    },
    inputDes: {
        fontSize: '17@ms',
    },
});

export default PlusScreen;
