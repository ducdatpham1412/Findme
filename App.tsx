import FindmeStore from 'app-redux/store';
import SocketProvider from 'hook/SocketProvider';
import RootScreen from 'navigation/screen/RootScreen';
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';
import I18Next from 'utility/I18Next';

const App: React.FunctionComponent = () => {
    return (
        <I18nextProvider i18n={I18Next}>
            <Provider store={FindmeStore}>
                <SocketProvider>
                    <RootScreen />
                </SocketProvider>
            </Provider>
        </I18nextProvider>
    );
};

export default App;
