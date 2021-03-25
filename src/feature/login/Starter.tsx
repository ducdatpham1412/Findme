import LoadingScreen from 'components/LoadingScreen';
import useRedux from 'hook/useRedux';
import React, {useEffect, useState} from 'react';
import {selectIsTheFirstTime} from 'utility/login/selectScreen';
import ChoosingLoginOrEnjoy from './ChoosingLoginOrEnjoy';
import LoginScreen from './LoginScreen';

const Starter = () => {
    const Redux = useRedux();
    const isLoading = Redux.getIsLoading();
    const [isFirstTime, setIsFirstTime] = useState(true);

    const select = async () => {
        const tempt = await selectIsTheFirstTime();
        setIsFirstTime(tempt);
    };

    useEffect(() => {
        select();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (isFirstTime) {
        return <ChoosingLoginOrEnjoy />;
    }

    return <LoginScreen />;
};

export default Starter;
