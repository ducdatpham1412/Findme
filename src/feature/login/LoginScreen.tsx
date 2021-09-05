import {useIsFocused} from '@react-navigation/native';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
} from 'components/base';
import StyleTouchable from 'components/base/StyleTouchable';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import AuthenticateService from 'utility/login/loginService';
import HeaderLogo from './components/HeaderLogo';
import ListSaveAcc from './components/ListSaveAcc';
import RemForPass from './components/RemForPass';

const LoginScreen = () => {
    const theme = Redux.getTheme();

    const [userRef, setUserRef] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const passRef = useRef<any>(null);

    const {username, password} = Redux.getLogin();
    const [user, setUser] = useState(username);
    const [pass, setPass] = useState(password);
    const [isKeepSign, setIsKeepSign] = useState(false);

    const getListAcc = async () => {
        const res = await FindmeAsyncStorage.getStorageAcc();
        setListSaveAcc(res);
    };

    useEffect(() => {
        getListAcc();
    }, [isFocused]);

    /**
     * FOR LIST SAVE ACC
     */
    const [listSaveAcc, setListSaveAcc] = useState<Array<any>>([]);
    const selectSaveAcc = (index: number) => {
        setUser(listSaveAcc[index].username);
        setPass(listSaveAcc[index].password);
    };
    const deleteSaveAcc = async (index: number) => {
        const tempt = listSaveAcc.slice();
        tempt.splice(index, 1);
        setListSaveAcc(tempt);
        FindmeAsyncStorage.deleteAccAtIndex(index);
    };

    // BUTTON LOGIN CLICK
    const submit = async () => {
        AuthenticateService.requestLogin({
            username: user,
            password: pass,
            isKeepSign,
        });
    };

    return (
        <StyleContainer
            keyboardShouldPersistTaps={
                // userRef && !user && !!listSaveAcc.length ? 'always' : 'handled'
                'handled'
            }>
            {/* LOGO AND SLOGAN ABOVE */}
            <HeaderLogo hasSlogan />
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
            <View style={styles.signUpView}>
                <View style={styles.signUpBox}>
                    <StyleText
                        i18Text="login.loginScreen.notHaveAcc"
                        customStyle={[
                            styles.notHaveAccText,
                            {color: theme.borderColor},
                        ]}
                    />
                    <StyleTouchable
                        onPress={() => navigate(LOGIN_ROUTE.signUpType)}>
                        <StyleText
                            i18Text="login.loginScreen.signUp"
                            customStyle={[
                                styles.signUpText,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
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

    goToStater: {
        position: 'absolute',
        left: '30@vs',
        top: '80@vs',
    },
    goToStaterIcon: {
        fontSize: '25@ms',
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

    // question sign up
    signUpView: {
        flex: 1,
        justifyContent: 'center',
    },
    notHaveAccText: {
        fontSize: '17@ms',
        fontStyle: 'italic',
    },
    signUpText: {
        fontSize: '17@ms',
        fontWeight: 'bold',
    },
    signUpBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: '20@vs',
    },
});

export default LoginScreen;
