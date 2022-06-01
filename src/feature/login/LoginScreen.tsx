import {useIsFocused} from '@react-navigation/native';
import {SIGN_UP_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
} from 'components/base';
import StyleTouchable from 'components/base/StyleTouchable';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import AuthenticateService from 'utility/login/loginService';
import ListSaveAcc from './components/ListSaveAcc';
import RemForPass from './components/RemForPass';

const loginForm = __DEV__
    ? {
          username: 'yeuquaimo@gmail.com',
          password: '12345678',
      }
    : {username: '', password: ''};

const LoginScreen = () => {
    const theme = Redux.getTheme();

    const [userRef, setUserRef] = useState(false);
    const isFocused = useIsFocused();
    const passRef = useRef<any>(null);

    const {username, password} = Redux.getLogin();
    const [user, setUser] = useState(username || loginForm?.username);
    const [pass, setPass] = useState(password || loginForm?.password);
    const [isKeepSign, setIsKeepSign] = useState(false);

    const getListAcc = useCallback(async () => {
        const res = await FindmeAsyncStorage.getStorageAcc();
        setListSaveAcc(res);
    }, []);

    useEffect(() => {
        getListAcc();
    }, [isFocused]);

    /**
     * For list acc saved
     */
    const [listSaveAcc, setListSaveAcc] = useState<Array<any>>([]);
    const selectSaveAcc = useCallback(
        (index: number) => {
            setUser(listSaveAcc[index].username);
            setPass(listSaveAcc[index].password);
        },
        [listSaveAcc],
    );
    const deleteSaveAcc = useCallback(
        async (index: number) => {
            const tempt = listSaveAcc.slice();
            tempt.splice(index, 1);
            setListSaveAcc(tempt);
            await FindmeAsyncStorage.deleteAccAtIndex(index);
        },
        [listSaveAcc],
    );

    // Click login
    const onSubmitLogin = async () => {
        await AuthenticateService.requestLogin({
            username: user.trim(),
            password: pass.trim(),
            isKeepSign,
        });
    };

    /**
     * Render view
     */
    const RenderBackground = useMemo(() => {
        return (
            <View style={styles.logoView}>
                <StyleImage
                    source={Images.images.logo}
                    style={[
                        styles.logoBlur,
                        {
                            tintColor: theme.backgroundButtonColor,
                        },
                    ]}
                    blurRadius={10}
                    resizeMode="contain"
                />
            </View>
        );
    }, [theme]);

    const RenderSpaceView = useMemo(() => {
        return (
            <>
                <View style={styles.spaceView} />
                <StyleTouchable
                    customStyle={styles.goToStater}
                    onPress={() => navigate(LOGIN_ROUTE.choosingLoginOrEnjoy)}>
                    <AntDesign
                        name="leftcircleo"
                        style={[
                            styles.goToStaterIcon,
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>
            </>
        );
    }, [theme]);

    const RenderRememberForgotPassword = useMemo(() => {
        return (
            <RemForPass
                isKeepSignIn={isKeepSign}
                onClickKeepSignIn={() => setIsKeepSign(!isKeepSign)}
            />
        );
    }, [isKeepSign]);

    const RenderSignUpText = useMemo(() => {
        return (
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
                        onPress={() =>
                            navigate(LOGIN_ROUTE.signUpForm, {
                                typeSignUp: SIGN_UP_TYPE.email,
                            })
                        }>
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
        );
    }, [theme]);

    const RenderListSaveAcc = useMemo(() => {
        return userRef && !user ? (
            <ListSaveAcc
                listAcc={listSaveAcc}
                selectAcc={selectSaveAcc}
                deleteAcc={deleteSaveAcc}
            />
        ) : null;
    }, [userRef, !!user, listSaveAcc]);

    return (
        <StyleContainer
            keyboardShouldPersistTaps={
                // userRef && !user && !!listSaveAcc.length ? 'always' : 'handled'
                'handled'
            }>
            {/* Logo space view */}
            {RenderBackground}

            {/* Space view */}
            {RenderSpaceView}

            {/* LOGIN BOX */}
            <View style={styles.login}>
                {/* username - password */}
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
                    returnKeyType="default"
                    secureTextEntry
                />

                {/* remember - forgot password */}
                {RenderRememberForgotPassword}

                {/* button login */}
                <StyleButton
                    title="login.loginScreen.signIn"
                    containerStyle={styles.loginButton}
                    disable={!user || !pass}
                    onPress={onSubmitLogin}
                />

                {RenderListSaveAcc}
            </View>

            {/* Sign up */}
            {RenderSignUpText}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    login: {
        minHeight: '40%',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    // logo view
    logoView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    logoBlur: {
        width: '100%',
        height: '350@vs',
        opacity: 0.25,
        marginTop: '20@vs',
    },
    // space view
    spaceView: {
        width: '100%',
        height: '130@vs',
    },
    // button go to starter
    goToStater: {
        position: 'absolute',
        left: '30@vs',
        top: '80@vs',
        opacity: 0.6,
    },
    goToStaterIcon: {
        fontSize: '25@ms',
    },
    // input
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
