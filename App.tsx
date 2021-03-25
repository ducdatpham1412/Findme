import FindmeStore from 'app-redux/store';
import RootScreen from 'navigation/screen/RootScreen';
import React, {useEffect} from 'react';
import {I18nextProvider} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import I18Next from 'utility/I18Next';

const App: React.FunctionComponent = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <I18nextProvider i18n={I18Next}>
            <Provider store={FindmeStore}>
                <RootScreen />
            </Provider>
        </I18nextProvider>
    );
};

export default App;
