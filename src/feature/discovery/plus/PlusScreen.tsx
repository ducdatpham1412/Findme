import {useIsFocused} from '@react-navigation/core';
import {apiChangeDisplayAvatar, apiUpdateMyBubbles} from 'api/module';
import {Metrics} from 'asset/metrics';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux, {HobbyType} from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {appAlert, goBack, popUpPicker} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {choosePrivateAvatar} from 'utility/assistant';
import BubbleCreate from '../components/BubbleCreate';

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
    const isFocused = useIsFocused();
    const {setShowTabBar} = useTabBar();

    const isModeExp = Redux.getModeExp();
    const {avatar} = Redux.getPassport().profile;
    const {display_avatar} = Redux.getPassport().setting;
    const {listHobbies} = Redux.getResource();
    const {listBubbles} = Redux.getPassport();

    const inputNameHobbyRef = useRef<TextInput>(null);

    const [tempDisplayAvatar, setTempDisplayAvatar] = useState(display_avatar);
    const [tempListBubbles, setTempListBubbles] = useState(listBubbles);

    const [showCreateBubble, setShowCreateBubble] = useState(false);
    const [indexEditing, setIndexEditing] = useState(0);

    const [hobbyChoose, setHobbyChoose] = useState<HobbyType>();
    const [nameHobbyChoose, setNameHobbyChoose] = useState('');
    const [description, setDescription] = useState('');

    const isOne = indexEditing === 0;
    const isTwo = indexEditing === 1;
    const isHobbyOther = hobbyChoose?.id === 8;

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
        setNameHobbyChoose(tempHobby.name);
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
        setNameHobbyChoose(tempHobby.name);
    }, [showCreateBubble]);

    useEffect(() => {
        if (isHobbyOther) {
            const x = setTimeout(() => {
                inputNameHobbyRef.current?.focus();
            }, 100);
            return () => clearTimeout(x);
        }
    }, [isHobbyOther]);

    // click, onLongPress one in one of two bubbles
    const chooseBubbleToEdit = (index: number) => {
        if (indexEditing === index) {
            setShowCreateBubble(!showCreateBubble);
        } else {
            setIndexEditing(index);
            setShowCreateBubble(true);
        }
    };

    // Picker hobby
    const onNavigateToPicker = useCallback(() => {
        popUpPicker({
            data: listHobbies,
            renderItem: (item: HobbyType) => (
                <View style={styles.elementPickerBox}>
                    <StyleImage
                        source={{uri: item.icon}}
                        customStyle={styles.iconPicker}
                    />
                    <StyleText
                        originValue={item.name}
                        customStyle={[
                            styles.namePicker,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            ),
            itemHeight: verticalScale(90),
            onSetItemSelected: (item: HobbyType) => {
                setHobbyChoose(item);
                setNameHobbyChoose(item.name);
            },
            initIndex:
                listHobbies.findIndex(item => item.id === hobbyChoose?.id) || 0,
        });
    }, [hobbyChoose]);

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
                name: nameHobbyChoose,
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
    const onGoBack = () => {
        goBack();
        setShowTabBar(true);
    };

    const onClickDone = async () => {
        try {
            Redux.setIsLoading(true);
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
            if (!isModeExp) {
                await apiUpdateMyBubbles({list: apiMyBubbles});
            }
            if (!tempListBubbles[1]) {
                // avoid delete bubble 1, but in redux still save index = 1
                // -> crash app in TabNavigator
                Redux.setIndexBubble(0);
            }
            Redux.updatePassport({listBubbles: tempListBubbles});
            onGoBack();
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    // render_view
    const HeaderLeftIcon = useMemo(() => {
        return (
            <AntDesign
                name="close"
                style={[styles.iconHeaderLeft, {color: theme.borderColor}]}
            />
        );
    }, []);

    const nameHeaderEye = tempDisplayAvatar ? 'eye' : 'eye-off';

    const HeaderEye = useMemo(() => {
        return (
            <Feather
                name={nameHeaderEye}
                style={[styles.iconHeaderEye, {color: theme.borderColor}]}
            />
        );
    }, [nameHeaderEye]);

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
            <View style={styles.spaceUp} />
            <View
                style={[
                    styles.container,
                    {
                        borderColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                <Header
                    headerLeft={HeaderLeftIcon}
                    headerLeftMission={onGoBack}
                    headerTitle={t('discovery.plus.headerTitle')}
                    headerRight2={HeaderEye}
                    headerRight2Mission={onShowOrHideAvatar}
                    headerRight3={TextDone}
                    headerRight3Mission={onClickDone}
                    containerStyle={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: theme.borderColor,
                    }}
                />

                <StyleContainer scrollEnabled isEffectTabBar={false}>
                    {/* Two bubbles */}
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

                    {/* Divider */}
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

                    {/* Box create bubble */}
                    {showCreateBubble && (
                        <View style={styles.createNewBox}>
                            {/* picker choosing hobby */}
                            <View style={styles.hobbyView}>
                                <StyleInput
                                    ref={inputNameHobbyRef}
                                    containerStyle={[
                                        styles.nameHobbyView,
                                        {borderBottomColor: theme.borderColor},
                                    ]}
                                    inputStyle={styles.inputHobbyName}
                                    value={nameHobbyChoose}
                                    onChangeText={text =>
                                        setNameHobbyChoose(text)
                                    }
                                    hasErrorBox={false}
                                    editable={isHobbyOther}
                                    isEffectTabBar={false}
                                    maxLength={30}
                                />
                                <StyleTouchable
                                    customStyle={styles.btnPickerView}
                                    onPress={onNavigateToPicker}>
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
                                    onChangeText={value =>
                                        setDescription(value)
                                    }
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
                                    maxLength={100}
                                    isEffectTabBar={false}
                                />
                            </View>

                            {/* button save creating */}
                            <StyleButton
                                title={
                                    tempListBubbles[indexEditing]
                                        ? 'discovery.plus.update'
                                        : 'discovery.plus.create'
                                }
                                containerStyle={styles.btnStyle}
                                onPress={onClickCreate}
                            />
                        </View>
                    )}
                </StyleContainer>
            </View>
        </>
    );
};

const styles = ScaledSheet.create({
    spaceUp: {
        height: Metrics.height / 5,
    },
    container: {
        flex: 1,
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderTopLeftRadius: '20@vs',
        borderTopRightRadius: '20@vs',
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
        borderBottomWidth: '0.5@ms',
    },
    inputHobbyName: {
        // paddingVertical: '10@ms',
        fontWeight: 'bold',
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
        paddingTop: '8@vs',
        paddingBottom: '12@vs',
        paddingHorizontal: '15@s',
        borderWidth: '0.5@ms',
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
    btnStyle: {
        paddingHorizontal: '30@s',
        paddingVertical: '10@vs',
        marginTop: '30@vs',
    },
    textDone: {
        fontSize: '15@ms',
        fontWeight: 'bold',
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
    // picker
    elementPickerBox: {
        width: '200@s',
        height: '70@vs',
        marginVertical: '10@vs',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconPicker: {
        width: '50@vs',
        height: '50@vs',
        marginRight: '20@s',
    },
    namePicker: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
});

export default PlusScreen;
