import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import React, {useEffect, useState} from 'react';
import {selectIsTheFirstTime} from 'utility/login/selectScreen';
import ChoosingLoginOrEnjoy from './ChoosingLoginOrEnjoy';
import LoginScreen from './LoginScreen';

const Starter = () => {
    const isLoading = Redux.getIsLoading();
    const [isFirstTime, setIsFirstTime] = useState(true);

    const select = async () => {
        const temp = await selectIsTheFirstTime();
        setIsFirstTime(temp);
    };

    useEffect(() => {
        select();
    }, []);

    if (isLoading) {
        return <LoadingScreen hasLogo={false} />;
    }

    if (isFirstTime) {
        return <ChoosingLoginOrEnjoy />;
    }

    return <LoginScreen />;
};

export default Starter;
