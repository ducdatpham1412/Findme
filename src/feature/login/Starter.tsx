import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {selectIsTheFirstTime} from 'utility/login/selectScreen';
import ChoosingLoginOrEnjoy from './ChoosingLoginOrEnjoy';
import LoginScreen from './LoginScreen';

const Starter = () => {
    const [isFirstTime, setIsFirstTime] = useState<undefined | boolean>(
        undefined,
    );

    const select = async () => {
        const temp = await selectIsTheFirstTime();
        setIsFirstTime(temp);
    };

    useEffect(() => {
        select();
    }, []);

    if (isFirstTime === undefined) {
        return <View />;
    }

    if (isFirstTime) {
        return <ChoosingLoginOrEnjoy />;
    }

    return <LoginScreen />;
};

export default Starter;
