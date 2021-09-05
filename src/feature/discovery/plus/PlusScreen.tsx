import {useIsFocused} from '@react-navigation/core';
import {apiChangeDisplayAvatar, apiUpdateMyBubbles} from 'api/module';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import StylePicker from 'components/base/picker/StylePicker';
import Redux, {HobbyType} from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {appAlert, goBack} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {choosePrivateAvatar} from 'utility/assistant';
import BubbleCreate from '../components/BubbleCreate';
import TextDone from '../components/TextDone';

/**
 * Contain 2 bubbles
 * Each bubble is create from 3 state:
 * 1. hobbyChose
 * 2. description
 * 3. avatar
 */

const PlusScreen = () => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();
    const {setShowTabBar} = useTabBar();
    const isFocused = useIsFocused();

    const {avatar} = Redux.getPassport().profile;
    const {display_avatar} = Redux.getPassport().setting;
    const {listBubbles, listHobbies} = Redux.getResource();

    const [tempDisplayAvatar, setTempDisplayAvatar] = useState(display_avatar);
    const [tempListBubbles, setTempListBubbles] = useState(listBubbles);

    const [showCreateBubble, setShowCreateBubble] = useState(false);
    const [indexEditing, setIndexEditing] = useState(0);
    const [showPickerHobby, setShowPickerHobby] = useState(false);

    const [hobbyChoose, setHobbyChoose] = useState<any>();
    const [description, setDescription] = useState('');

    const isOne = indexEditing === 0;
    const isTwo = indexEditing === 1;

    useEffect(() => {
        if (isFocused) {
            setTempDisplayAvatar(display_avatar);
        }
    }, [isFocused]);

    useEffect(() => {
        const point = tempListBubbles[indexEditing];
        const tempDescription = point?.description || '';
        const tempHobby = point
            ? {
                  id: point.idHobby,
                  icon: point.icon,
                  name: point.name,
              }
            : listHobbies[0];
        setHobbyChoose(tempHobby);
        setDescription(tempDescription);
    }, [indexEditing]);

    useEffect(() => {
        const point = tempListBubbles[indexEditing];
        const tempHobby = point
            ? {
                  id: point.idHobby,
                  icon: point.icon,
                  name: point.name,
              }
            : listHobbies[0];
        setHobbyChoose(tempHobby);
    }, [showCreateBubble]);

    // click, onLongPress one in one of two bubbles
    const chooseBubbleToEdit = (index: number) => {
        if (indexEditing === index) {
            setShowCreateBubble(!showCreateBubble);
        } else {
            setIndexEditing(index);
            setShowCreateBubble(true);
        }
    };

    // change hobby in Picker
    const chooseHobby = (value: HobbyType) => {
        setHobbyChoose(value);
        setShowPickerHobby(false);
    };

    // delete Bubble
    const deleteBubble = (index: number) => {
        const temp = [...tempListBubbles];
        temp.splice(index, 1);
        setTempListBubbles(temp);
    };

    // click btn "Create / Update"
    const onClickCreate = () => {
        const temp = [...tempListBubbles];
        const index = indexEditing === 0 ? 0 : tempListBubbles[0] ? 1 : 0;
        if (hobbyChoose) {
            temp[index] = {
                idHobby: hobbyChoose.id,
                name: hobbyChoose.name,
                icon: hobbyChoose.icon,
                description,
                privateAvatar: tempDisplayAvatar
                    ? avatar
                    : choosePrivateAvatar(),
            };
            setShowCreateBubble(false);
            setTempListBubbles(temp);
        }
    };

    // click "Show/Hide avatar" in header
    const onShowOrHideAvatar = () => {
        // if is showing, set to false
        if (tempDisplayAvatar) {
            const temp = tempListBubbles.map(item => ({
                ...item,
                privateAvatar: choosePrivateAvatar(),
            }));
            setTempListBubbles(temp);
            setTempDisplayAvatar(false);
        }
        // if not, set back to true
        else {
            const temp = tempListBubbles.map(item => ({
                ...item,
                privateAvatar: avatar,
            }));
            setTempListBubbles(temp);
            setTempDisplayAvatar(true);
        }
    };

    // Click button "Save"
    const onClickDone = async () => {
        try {
            Redux.updateResource({listBubbles: tempListBubbles});

            if (tempDisplayAvatar !== display_avatar) {
                await apiChangeDisplayAvatar(tempDisplayAvatar);
                Redux.updatePassport({
                    setting: {display_avatar: tempDisplayAvatar},
                });
            }

            const apiMyBubbles = tempListBubbles.map(item => ({
                idHobby: item.idHobby,
                description: item.description,
            }));

            await apiUpdateMyBubbles({list: apiMyBubbles});

            setShowTabBar(true);
            goBack();
        } catch (err) {
            appAlert(err);
        }
    };

    // render_view
    const headerLeftIcon = () => {
        return (
            <AntDesign
                name="close"
                style={[styles.iconHeaderLeft, {color: theme.borderColor}]}
            />
        );
    };

    const nameHeaderEye = tempDisplayAvatar ? 'eye' : 'eye-off';
    const HeaderEye = (
        <Feather
            name={nameHeaderEye}
            style={[styles.iconHeaderEye, {color: theme.borderColor}]}
        />
    );

    return (
        <>
            <Header
                headerLeft={headerLeftIcon()}
                headerLeftMission={() => {
                    setShowTabBar(true);
                    goBack();
                }}
                headerTitle={t('discovery.plus.headerTitle')}
                headerRight2={HeaderEye}
                headerRight2Mission={onShowOrHideAvatar}
                headerRight3={<TextDone title="common.save" />}
                headerRight3Mission={onClickDone}
            />

            <StyleContainer
                containerStyle={styles.container}
                scrollEnabled
                isEffectTabBar={false}>
                {/* TWO BUBBLES */}
                <View style={styles.twoBubblesBox}>
                    <BubbleCreate
                        item={tempListBubbles[0]}
                        showCreateBubble={showCreateBubble}
                        editBubble={() => chooseBubbleToEdit(0)}
                        deleteBubble={() => deleteBubble(0)}
                    />
                    <BubbleCreate
                        item={tempListBubbles[1]}
                        showCreateBubble={showCreateBubble}
                        editBubble={() => chooseBubbleToEdit(1)}
                        deleteBubble={() => deleteBubble(1)}
                    />
                </View>

                {/* DIVIDER */}
                <View style={styles.dividerView}>
                    <View
                        style={[
                            styles.dividerElement,
                            {
                                borderWidth: isOne ? 2 : 0,
                                borderColor: theme.borderColor,
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.dividerElement,
                            {
                                borderWidth: isTwo ? 2 : 0,
                                borderColor: theme.borderColor,
                            },
                        ]}
                    />
                </View>

                {/* BOX CREATE BUBBLE */}
                {showCreateBubble && (
                    <View style={styles.createNewBox}>
                        {/* picker choosing hobby */}
                        <View style={styles.hobbyView}>
                            <View
                                style={[
                                    styles.nameHobbyView,
                                    {borderBottomColor: theme.borderColor},
                                ]}>
                                <StyleText
                                    originValue={
                                        hobbyChoose?.name || listHobbies[0].name
                                    }
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

                        {/* enter input description */}
                        <View
                            style={[
                                styles.desBox,
                                {borderColor: theme.borderColor},
                            ]}>
                            <StyleInput
                                value={description}
                                onChangeText={value => setDescription(value)}
                                i18Placeholder="discovery.plus.holderDes"
                                placeholderTextColor={theme.holderColor}
                                containerStyle={styles.inputView}
                                inputStyle={[
                                    styles.inputDes,
                                    {color: theme.textColor},
                                ]}
                                multiline
                                hasUnderLine={false}
                                hasErrorBox={false}
                                maxLength={20}
                            />
                        </View>

                        {/* button save creating */}
                        <StyleButton
                            title={
                                tempListBubbles[indexEditing]
                                    ? 'discovery.plus.update'
                                    : 'discovery.plus.create'
                            }
                            titleStyle={styles.titleBtn}
                            containerStyle={styles.btnStyle}
                            onPress={onClickCreate}
                        />
                    </View>
                )}
            </StyleContainer>

            {showPickerHobby && (
                <StylePicker
                    dataList={listHobbies}
                    mission={chooseHobby}
                    onTouchOut={() => setShowPickerHobby(false)}
                />
            )}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'transparent',
    },
    headerLeft: {
        fontSize: '20@ms',
    },
    iconHeaderEye: {
        fontSize: '20@ms',
    },
    twoBubblesBox: {
        width: '100%',
        height: '170@vs',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    createNewBox: {
        width: '100%',
        height: '200@vs',
        alignItems: 'center',
    },
    hobbyView: {
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
        borderWidth: 0.5,
        borderRadius: '15@vs',
    },
    // input description
    inputView: {
        width: '100%',
    },
    inputDes: {
        fontSize: '17@ms',
        paddingHorizontal: 0,
    },
    // button
    titleBtn: {
        fontSize: '20@ms',
    },
    btnStyle: {
        paddingHorizontal: '30@s',
        paddingVertical: '10@vs',
        marginTop: '30@vs',
    },
    // divider
    dividerView: {
        width: '100%',
        flexDirection: 'row',
    },
    dividerElement: {
        flex: 1,
    },
    iconHeaderLeft: {
        fontSize: '20@ms',
    },
});

export default PlusScreen;
