import {API_URL} from '@env';
import {errorKeyEnums} from 'asset/error';
import axios from 'axios';
import Redux from 'hook/useRedux';
import {logger} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import AuthenticateService from 'utility/login/loginService';

const AUTH_URL_REFRESH_TOKEN = `${API_URL}/auth/refresh-token`;

const request = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        Accept: '*/*',
    },
});

// for multiple requests
let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: string | null | undefined = null) => {
    failedQueue.forEach((item: any) => {
        if (error) {
            item.reject(error);
        } else {
            item.resolve(token);
        }
    });

    failedQueue = [];
};

request.interceptors.request.use(
    async (config: any) => {
        // Do something before api is sent
        const {token} = await FindmeAsyncStorage.getActiveUser();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        // Do something with api error
        logger(
            `%c FAILED ${error.response.method?.toUpperCase()} from ${
                error.response.config.url
            }:`,
        );
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    (response: any) => response.data,

    async (error: any) => {
        // Do something with response error
        const {response, config} = error || {};
        const {data} = response || {};
        const {errorMessage, errorKey} = data || {};

        // logger('config is: \n', config);

        logger(
            `FAILED ${error.config?.method?.toUpperCase()} from ${
                error?.config?.url
            }: ${errorMessage}`,
        );

        // handler token blacklisted
        if (
            errorKey === errorKeyEnums.token_blacklisted
            // || errorKey === errorKeyEnums.username_not_exist
        ) {
            logger('Refresh_Token_Expired => Logout');
            AuthenticateService.logOut();
            return Promise.reject(String(errorMessage) || 'Have some errors');
        }

        // handle token expired
        if (
            ((response && response.status === 401) ||
                errorKey === errorKeyEnums.token_expired) &&
            !config.retry
        ) {
            if (isRefreshing) {
                try {
                    const queuePromise: any = await new Promise(
                        (resolve: any, reject: any) => {
                            failedQueue.push({resolve, reject});
                        },
                    );
                    config.headers.Authorization = `Bearer ${queuePromise.token}`;
                    return request(config);
                } catch (err) {
                    return Promise.reject(String(err));
                }
            }
            logger('Refreshing token');
            config.retry = true;
            isRefreshing = true;

            const {refreshToken} = await FindmeAsyncStorage.getActiveUser();

            try {
                const refreshTokenResponse = await axios.post(
                    AUTH_URL_REFRESH_TOKEN,
                    {
                        refresh: refreshToken,
                    },
                );

                const token = refreshTokenResponse.data.data.access;

                await FindmeAsyncStorage.updateActiveUser({token});
                Redux.setToken(token);

                config.headers.Authorization = `Bearer ${token}`;
                processQueue(null, token);
                return request(config);
            } catch (err) {
                logger('Refresh Token Failed: ', err);
                processQueue(err, null);
                return Promise.reject(String(err));
            } finally {
                isRefreshing = false;
            }
        }

        error.message = errorMessage || 'Have some errors';
        error.keyMessage = errorKey || 0;
        return Promise.reject(String(error.message));
    },
);

export default request;
