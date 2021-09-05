declare module '@env' {
    export const APP_NAME: string;
    export const API_URL: string;

    // dynamic link
    export const API_SOCKET: string;

    // android
    export const ANDROID_APP_ID: string;
    export const ANDROID_APP_VERSION_NAME: string;
    export const ANDROID_APP_VERSION_CODE: string;

    // ios
    export const IOS_APP_ID: string;
    export const IOS_APP_BUILD_CODE: string;
    export const IOS_APP_VERSION_CODE: string;
    // codePush

    export const CODEPUSH_ANDROID_DEVELOPMENT_KEY: string;
    export const CODEPUSH_IOS_DEVELOPMENT_KEY: string;

    // other keys
    export const GOOGLE_MAPS_API_KEY: string;
}
