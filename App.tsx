import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FindmeStore from 'app-redux/store';
import {SocketProvider} from 'hook/useSocketIO';
import DynamicLink from 'navigation/screen/DynamicLink';
import RootScreen from 'navigation/screen/RootScreen';
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {LogBox} from 'react-native';
import Config from 'react-native-config';
import {Provider} from 'react-redux';
import {addMenuClearAsyncStorage} from 'utility/assistant';
import I18Next from 'utility/I18Next';

if (__DEV__) {
    LogBox.ignoreLogs(['componentWillMount', 'Non-serializable']);
    addMenuClearAsyncStorage();
}

GoogleSignin.configure({
    webClientId: Config.WEB_CLIENT_ID_GOOGLE_SIGN_IN,
});

const App = () => {
    return (
        <I18nextProvider i18n={I18Next}>
            <Provider store={FindmeStore}>
                <SocketProvider>
                    <DynamicLink />
                    <RootScreen />
                </SocketProvider>
            </Provider>
        </I18nextProvider>
    );
};

export default App;
