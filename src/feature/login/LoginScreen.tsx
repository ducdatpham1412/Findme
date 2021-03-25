import {useIsFocused} from '@react-navigation/native';
import {StyleButton, StyleContainer, StyleInput} from 'components/base';
import StyleTouchable from 'components/base/StyleTouchable';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import {requestLogin} from 'utility/login/loginService';
import HeaderLogo from './components/HeaderLogo';
import ListSaveAcc from './components/ListSaveAcc';
import RemForPass from './components/RemForPass';
import SwitchToSignUp from './components/SwitchToSignUp';

const LoginScreen = () => {
    const Redux = useRedux();
    const theme = Redux.getTheme();
    const [userRef, setUserRef] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const passRef = useRef<any>(null);

    const [user, setUser] = useState(Redux.getLogin().username);
    const [pass, setPass] = useState(Redux.getLogin().password);
    const [isKeepSign, setIsKeepSign] = useState(false);

    /**
     *
     */
    const [listSaveAcc, setListSaveAcc] = useState<Array<any>>([]);
    const selectSaveAcc = (index: number) => {
        setUser(listSaveAcc[index].username);
        setPass(listSaveAcc[index].password);
        FindmeAsyncStorage.setIndexNow(index);
    };
    const deleteSaveAcc = async (index: number) => {
        const tempt = listSaveAcc.slice();
        tempt.splice(index, 1);
        setListSaveAcc(tempt);
        FindmeAsyncStorage.deleteAccAtIndex(index);
    };

    const getListAcc = async () => {
        const res = await FindmeAsyncStorage.getStorageAcc();
        setListSaveAcc(res);
    };

    useEffect(() => {
        getListAcc();
    }, [isFocused]);

    // BUTTON LOGIN CLICK
    const submit = async () => {
        requestLogin(user, pass, isKeepSign);
    };

    return (
        <StyleContainer
            keyboardShouldPersistTaps={
                userRef && !user && !!listSaveAcc.length ? 'always' : 'handled'
            }>
            {/* LOGO AND SLOGAN ABOVE */}
            <HeaderLogo hasName={true} hasSlogan={true} />
            <StyleTouchable
                customStyle={styles.goToStater}
                onPress={() => navigate(LOGIN_ROUTE.choosingLoginOrEnjoy)}>
                <AntDesign
                    name="leftcircleo"
                    style={[styles.goToStaterIcon, {color: theme.borderColor}]}
                />
            </StyleTouchable>

            {/* LOGIN BOX */}
            <View style={styles.login}>
                {/* USERNAME AND PASSWORD */}
                <StyleInput
                    i18Placeholder="login.loginScreen.username"
                    value={user}
                    onChangeText={value => setUser(value)}
                    containerStyle={styles.inputForm}
                    onFocus={() => setUserRef(true)}
                    onBlur={() => setUserRef(false)}
                    onSubmitEditing={() => passRef.current.focus()}
                />

                <StyleInput
                    ref={passRef}
                    i18Placeholder="login.loginScreen.password"
                    value={pass}
                    onChangeText={value => setPass(value)}
                    containerStyle={styles.inputForm}
                    returnKeyType="done"
                    secureTextEntry={true}
                />

                {/* REMEMBER - FORGOT PASS */}
                <RemForPass
                    isKeepSignIn={isKeepSign}
                    onClickKeepSignIn={() => setIsKeepSign(!isKeepSign)}
                />

                {/* BUTTON LOGIN */}
                <StyleButton
                    title="login.loginScreen.signIn"
                    containerStyle={styles.loginButton}
                    disable={!user || !pass}
                    onPress={submit}
                />

                {userRef && !user && (
                    <ListSaveAcc
                        listAcc={listSaveAcc}
                        selectAcc={selectSaveAcc}
                        deleteAcc={deleteSaveAcc}
                    />
                )}
            </View>

            {/* QUESTION SIGN UP */}
            <View style={styles.signUp}>
                <SwitchToSignUp />
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    login: {
        minHeight: '40%',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    signUp: {
        flex: 1,
        justifyContent: 'center',
    },

    goToStater: {
        position: 'absolute',
        left: '30@vs',
        top: '80@vs',
    },
    goToStaterIcon: {
        fontSize: 30,
    },

    inputForm: {
        marginVertical: '10@vs',
    },

    // button login
    loginButton: {
        borderRadius: '20@vs',
        paddingHorizontal: '60@vs',
        marginTop: '30@vs',
    },
    loginText: {
        fontSize: 25,
    },
});

export default LoginScreen;
