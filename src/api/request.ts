/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import FindmeStore from 'app-redux/store';
import {ERROR_KEY_ENUM} from 'asset/error';
import axios from 'axios';
import Redux from 'hook/useRedux';
import Config from 'react-native-config';
import {logger} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import AuthenticateService from 'utility/login/loginService';

const baseURL = Config.API_URL;
// const baseURL = 'http://10.254.181.93:8000';

const AUTH_URL_REFRESH_TOKEN = `${baseURL}/auth/refresh-token`;

const request = axios.create({
    baseURL,
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
        if (config?.headers?.Authorization) {
            return config;
        }
        // Do something before api is sent
        let token: any = FindmeStore.getState().logicSlice.token;
        if (!token) {
            token = (await FindmeAsyncStorage.getActiveUser()).token;
        }
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
        const {response, config} = error || {};
        const {data} = response || {};
        const {errorMessage, errorKey} = data || {};

        if (errorKey === ERROR_KEY_ENUM.token_expired && !config.retry) {
            // if is refreshing token in other request
            if (isRefreshing) {
                try {
                    const queuePromise: any = await new Promise(
                        (resolve, reject) => {
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
                const res = await axios.post(AUTH_URL_REFRESH_TOKEN, {
                    refresh: refreshToken,
                });
                const newToken = res.data.data.access;

                await FindmeAsyncStorage.updateActiveUser({token: newToken});
                Redux.setToken(newToken);

                config.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);

                return request(config);
            } catch (err) {
                // handle when refreshing token, refresh is blacked list
                const temp: any = err;
                console.log('temp is: ', temp);
                const _error = temp.response.data;
                if (_error.errorKey === ERROR_KEY_ENUM.token_blacklisted) {
                    AuthenticateService.logOut({hadRefreshTokenBlacked: true});
                }
                return Promise.reject(_error.errorMessage);
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
