import {StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';

interface CreateBubbleProps {
    setShowPicker: any;
    hobbyChoose: any;
}

const CreateBubble = (props: CreateBubbleProps) => {
    const {setShowPicker, hobbyChoose} = props;
    const Redux = useRedux();
    const theme = Redux.getTheme();

    return (
        <View style={styles.container}>
            <View style={styles.hobbyBox}>
                <View
                    style={[
                        styles.nameHobbyView,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    <StyleText
                        originValue={hobbyChoose.name || 'Hobby'}
                        customStyle={[
                            styles.hobbyText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
                <StyleTouchable
                    customStyle={styles.btnPickerView}
                    onPress={() => setShowPicker(true)}>
                    <Entypo
                        name="round-brush"
                        style={[styles.icon, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
            </View>

            <View style={styles.desBox}>
                <TextInput
                    placeholder="hehehe"
                    placeholderTextColor={theme.holderColor}
                    // multiline
                    style={[styles.inputDes, {color: theme.textColor}]}
                />
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
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

export default CreateBubble;
