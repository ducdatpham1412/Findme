import {API_URL} from '@env';
import request from 'api/request';
import {StyleContainer, StyleText} from 'components/base';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {logger} from 'utility/assistant';

const AboutFindme = () => {
    const [listUser, setListUser] = useState<Array<any>>([]);

    const getData = async () => {
        try {
            const res = await request.get('/auth/all');
            logger('response is: ', res);
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <StyleContainer customStyle={styles.container}>
            <StyleText originValue={API_URL} />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AboutFindme;
