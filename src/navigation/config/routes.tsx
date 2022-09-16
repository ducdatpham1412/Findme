const ROOT_SCREEN = {
    loginRoute: '@ROOT_SCREEN/loginRoute',
    mainScreen: '@ROOT_SCREEN/mainScreen',
    // others
    alert: '@ROOT_SCREEN/alert',
    alertYesNo: '@ROOT_SCREEN/alertYesNo',
    interactBubble: '@ROOT_SCREEN/interactBubble',
    swipeImages: '@ROOT_SCREEN/swipeImage',
    reportUser: '@ROOT_SCREEN/reportUser',
    webView: '@ROOT_SCREEN/webview',
    picker: '@ROOT_SCREEN/picker',
    otherProfile: '@ROOT_SCREEN/otherProfile',
    listFollows: '@ROOT_SCREEN/listFollows',
    detailBubble: '@ROOT_SCREEN/detailBubble',
};
/**
 * ||
 * ||
 */
const LOGIN_ROUTE = {
    starter: '@LOGIN_ROUTE/starter',
    choosingLoginOrEnjoy: '@LOGIN_ROUTE/choosingLoginOrEnjoy',
    loginScreen: '@LOGIN_ROUTE/loginScreen',
    confirmOpenAccount: '@LOGIN_ROUTE/confirmOpenAccount',
    // THIS BLOCK IS FOR SIGN_UP FORM
    signUpType: '@LOGIN_ROUTE/signUpType',
    signUpForm: '@LOGIN_ROUTE/signUpForm',
    editBasicInformation: '@LOGIN_ROUTE/editBasicInformation',
    // ------------------------------
    // THIS BLOCK IF FOR FORGET_PASSWORD
    forgetPasswordType: '@LOGIN_ROUTE/forgetPasswordType',
    forgetPasswordSend: '@LOGIN_ROUTE/forgetPasswordSend',
    forgetPasswordConfirm: '@LOGIN_ROUTE/forgetPasswordConfirm',
    forgetPasswordForm: '@LOGIN_ROUTE/forgetPasswordForm',
    // ------------------------------
    sendOTP: '@LOGIN_ROUTE/sendOTP',
    agreeTermOfService: '@LOGIN_ROUTE/agreeTermOfService',
};
const MAIN_SCREEN = {
    discoveryRoute: '@MAIN_SCREEN/discoveryRoute',
    reputation: '@MAIN_SCREEN/reputation',
    profileRoute: '@MAIN_SCREEN/profileRoute',
    settingRoute: '@MAIN_SCREEN/settingRoute',
    messRoute: '@MAIN_SCREEN/messRoute',
    notificationRoute: '@MAIN_SCREEN/notificationRoute',
};

/**
 * ||
 * ||
 */
const DISCOVERY_ROUTE = {
    discoveryScreen: '@DISCOVERY_ROUTE/discoveryScreen',
    detailGroupBuying: '@DISCOVERY_ROUTE/detailGroupBuying',
};

const MESS_ROUTE = {
    messScreen: '@MESS_ROUTE/messScreen',
    chatDetail: '@MESS_ROUTE/chatDetail',
    chatDetailGroup: '@MESS_ROUTE/chatDetailGroup',
    chatDetailSetting: '@MESS_ROUTE/chatDetailSetting',
};

const PROFILE_ROUTE = {
    myProfile: '@PROFILE_ROUTE/myProfile',
    editProfile: '@PROFILE_ROUTE/editProfile',
    settingRoute: '@PROFILE_ROUTE/settingRoute',
    createPostPreview: '@PROFILE_ROUTE/createPostPreview',
    createPostPickImg: '@PROFILE_ROUTE/createPostPickImg',
    detailGroupBuying: '@PROFILE_ROUTE/detailGroupBuying',
};
/**
 * ||
 * || Setting live inside profile_screen
 */
const SETTING_ROUTE = {
    settingScreen: '@SETTING_ROUTE/settingScreen',
    security: '@SETTING_ROUTE/security',
    confirmLockAccount: '@SETTING_ROUTE/confirmLockAccount',
    confirmDeleteAccount: '@SETTING_ROUTE/confirmdeleteAccount',
    personalInformation: '@SETTING_ROUTE/personalInformation',
    sendOTPChangeInfo: '@SETTING_ROUTE/sendOTPChangeInfo',
    enterPassword: '@SETTING_ROUTE/enterPassword',
    aboutUs: '@SETTING_ROUTE/aboutUs',
    setTheme: '@SETTING_ROUTE/setTheme',
};

export {LOGIN_ROUTE, MAIN_SCREEN};
export {DISCOVERY_ROUTE, PROFILE_ROUTE, SETTING_ROUTE, MESS_ROUTE};
export default ROOT_SCREEN;
