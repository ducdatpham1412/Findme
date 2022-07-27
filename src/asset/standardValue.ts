/* eslint-disable no-shadow */
import Config from 'react-native-config';

export const standValue = {
    USERNAME_MIN_LENGTH: 7,
    USERNAME_MAX_LENGTH: 20,
    PASSWORD_MIN_LENGTH: 7,
    PASSWORD_MAX_LENGTH: 20,
    COUNT_DOWN: 20,
    OTP_LENGTH: 4,
};

export const STAND_FONT_SIZE = {
    small: 15,
    medium: 20,
    big: 25,
    large: 28,
};

export enum COVER_SIZE {
    width = 1500,
    height = 565,
}

export enum AVATAR_SIZE {
    width = 2000,
    height = 2000,
}

export const SIZE_LOADING_LIMIT = 20;

export enum PRIVATE_AVATAR {
    girl = 'https://doffy.s3.ap-southeast-1.amazonaws.com/image/__admin_girl.png',
    boy = 'https://doffy.s3.ap-southeast-1.amazonaws.com/image/__admin_boy.png',
    lgbt = 'https://doffy.s3.ap-southeast-1.amazonaws.com/image/__admin_lgbt.png',
}

export const DEFAULT_IMAGE_BACKGROUND =
    'https://doffy-production.s3.ap-southeast-1.amazonaws.com/admin/background.png';

export const TIMING_BUBBLE_FLY = 40000;

export const SUPPORT_URL = 'https://www.doffy.xyz/about-us/support';
export const PRIVACY_URL = 'https://www.doffy.xyz/about-us/policy';
export const TERMS_URL = 'https://www.doffy.xyz/about-us/terms';
export const FEEDBACK_URL =
    'https://docs.google.com/forms/d/1Yb-OzSMJbJxG_RZYtPwkKZGjw4AZOsC2IvJlac-1ydI/edit?usp=sharing';
export const GUIDELINE_URL = 'https://www.doffy.xyz/about-us/guideline';
export const LANDING_PAGE_URL = 'https://www.doffy.xyz/';
export const REPORT_REASONS = [
    {
        id: 0,
        name: 'discovery.report.offensiveLanguage',
    },
    {
        id: 1,
        name: 'discovery.report.dangerousAction',
    },
    {
        id: 2,
        name: 'discovery.report.spamRuining',
    },
    {
        id: 3,
        name: 'discovery.report.insultToMe',
    },
    {
        id: 4,
        name: 'discovery.report.otherReason',
    },
];

export const DELAY_LONG_PRESS = 150;

export const DYNAMIC_LINK_SHARE = 'https://doffy.page.link';
export const DYNAMIC_LINK_IOS = Config.IOS_APP_ID;
export const DYNAMIC_LINK_ANDROID = Config.ANDROID_APP_ID;

export const ANDROID_APP_LINK =
    'https://play.google.com/store/apps/details?id=com.doffy.android.production';
