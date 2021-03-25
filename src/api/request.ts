import axios from 'axios';
import useRedux from 'hook/useRedux';
import {logger} from 'utility/assistant';
import {AuthenticateService} from 'utility/login/loginService';

const AUTH_URL_REFRESH_TOKEN = '/auth/request-access-token';

const request = axios.create({
    baseURL: 'http',
    timeout: 5000,
    headers: {Accept: '*/*'},
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
        const token = useRedux().getToken();
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

        logger(
            `FAILED ${error.config?.method?.toUpperCase()} from ${
                error?.config?.url
            }: ${response}`,
        );

        if (
            errorKey === 'Refresh_Token_Expire' ||
            errorKey === 'Member_Not_Exist'
        ) {
            logger('Refresh_Token_Expired => Logout');
            AuthenticateService.logOut();
            return Promise.reject(errorMessage || 'Have some errors');
        }

        if (
            ((response && response.status === 401) ||
                errorKey === 'Token_Expired') &&
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
                    return Promise.reject(err);
                }
            }
            logger('Refreshing token');
            config.retry = true;
            isRefreshing = true;

            const localRefreshToken = useRedux().getRefreshToken();
            try {
                const refreshTokenResponse = await axios.post(
                    AUTH_URL_REFRESH_TOKEN,
                    {
                        refreshToken: localRefreshToken,
                    },
                );

                const {token} = refreshTokenResponse.data.data;
                useRedux().setNewToken(token);
                config.headers.Authorization = `Bearer ${token}`;
                processQueue(null, token);
                return request(config);
            } catch (err) {
                logger('Refresh Token Failed: ', err);
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        error.message = errorMessage || 'Have some errors';
        error.keyMessage = errorKey || '';
        return Promise.reject(error.message);
    },
);

export default request;
