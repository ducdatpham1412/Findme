const ROOT_SCREEN = {
    loginRoute: '@ROOT_SCREEN/loginRoute',
    mainScreen: '@ROOT_SCREEN/mainScreen',
    alert: '@ROOT_SCREEN/alert',
};
/**
 * ||
 * ||
 */
const LOGIN_ROUTE = {
    starter: '@LOGIN_ROUTE/starter',
    choosingLoginOrEnjoy: '@LOGIN_ROUTE/choosingLoginOrEnjoy',
    loginScreen: '@LOGIN_ROUTE/loginScreen',
    // THIS BLOCK IS FOR SIGN_UP FORM
    signUpType: '@LOGIN_ROUTE/signUpType',
    signUpForm: '@LOGIN_ROUTE/signUpForm',
    detailInformation: '@LOGIN_ROUTE/detailInformation',
    // ------------------------------
    // THIS BLOCK IF FOR FORGET_PASSWORD
    forgetPasswordType: '@LOGIN_ROUTE/forgetPasswordType',
    forgetPasswordInput: '@LOGIN_ROUTE/forgetPasswordInput',
    forgetPasswordConfirm: '@LOGIN_ROUTE/forgetPasswordConfirm',
    forgetPasswordForm: '@LOGIN_ROUTE/forgetPasswordForm',
    // ------------------------------
    sendOTP: '@LOGIN_ROUTE/sendOTP',
};
const MAIN_SCREEN = {
    discoveryRoute: '@MAIN_SCREEN/discoveryRoute',
    profileRoute: '@MAIN_SCREEN/profileRoute',
    settingRoute: '@MAIN_SCREEN/settingRoute',
};
/**
 * ||
 * ||
 */
const DISCOVERY_ROUTE = {
    discoveryScreen: '@DISCOVERY_ROUTE/discoveryScreen',
    heartScreen: '@DISCOVERY_ROUTE/heartScreen',
    plusScreen: '@DISCOVERY_ROUTE/plusScreen',
};
const PROFILE_ROUTE = {
    profileScreen: '@PROFILE_ROUTE/profileScreen',
    editProfile: '@PROFILE_ROUTE/editProfile',
    settingRoute: '@PROFILE_ROUTE/settingRoute',
};
/**
 * ||
 * || Setting live inside profile_screen
 */
const SETTING_ROUTE = {
    settingScreen: '@SETTING_ROUTE/settingScreen',
    security: '@SETTING_ROUTE/security',
    personalInformation: '@SETTING_ROUTE/personalInformation',
    aboutFindme: '@SETTING_ROUTE/aboutFindme',
    setTheme: '@SETTING_ROUTE/setTheme',
};

const MESS_ROUTE = {
    messScreen: '@MESS_ROUTE/messScreen',
    chatDetail: '@MESS_ROUTE/chatDetail',
};

export {LOGIN_ROUTE, MAIN_SCREEN};
export {DISCOVERY_ROUTE, PROFILE_ROUTE, SETTING_ROUTE, MESS_ROUTE};
export default ROOT_SCREEN;
