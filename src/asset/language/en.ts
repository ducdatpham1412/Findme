const login = {
    component: {
        sendOTP: {
            header: 'Confirm OTP',
            enterCode: 'Enter',
            confirmButton: 'Confirm',
            sendAgain: 'Send again ({{countdown}})',
            notiOTP: 'Enter OTP code Findme sent to',
        },
    },
    forgetPassword: {
        type: {
            header: 'Forgot password',
            chooseMethod: 'Choose method restoring password',
            user: 'Username',
            phone: 'Phone no',
        },
        input: {
            header: 'Forgot password',
            username: 'Enter your username',
            email: 'Enter your email',
            phone: 'Enter your phone',
            sendOTP: 'Send OTP',
        },
        form: {
            header: 'Set up password',
            newPass: 'New password',
            confirmPass: 'Confirm password',
            buttonDone: 'Done',
        },
    },
    signUp: {
        type: {
            header: 'Sign up',
            chooseMethod: 'Choose method signing up',
            phone: 'Phone no',
        },
        form: {
            header: 'Sign up',
            username: 'Username',
            password: 'Password',
            confirmPass: 'Confirm password',
            confirmButton: 'Confirm',
            enterEmail: 'Enter your email',
            enterPhone: 'Enter phone number',
        },
    },
    detailInformation: {
        header: 'OK !',
        noti: "Let's create your own profile",
        listGender: 'Man, Woman, Prefer not to say',
        done: 'Ok done',
        nameHolder: 'Findme name',
    },
    loginScreen: {
        slogan: 'Someone waiting for you',
        username: 'Username',
        password: 'Password',
        keepSignIn: 'Keep sign in',
        forgotPass: 'Forgot password ?',
        signIn: 'Sign in',
        notHaveAcc: "Haven't account?",
        signUp: ' Sign up',
        enjoyModeNoAcc: 'Enjoy mode NoAccount',
    },
};

// DISCOVERY ROUTE
const discovery = {
    component: {},
    heart: {
        headerTitle: 'Chat hobbies',
        done: 'Done',
    },
    plus: {
        headerTitle: 'Bubble chat',
    },
    push: {},
    discoveryScreen: {
        searchHobbies: 'Find hobbies',
        searchChat: 'Find chat',
    },
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Messages',
    },
};

// PROFILE ROUTE
const profile = {
    component: {
        infoProfile: {
            follower: 'Followers',
            following: 'Following',
            introduce:
                'Sign up for more chat enjoy and make your own profile !',
            tellSignUp: 'Go to sign up',
            editProfile: 'Edit own profile',
        },
        searchAndSetting: 'Finding others',
    },
    edit: {
        headerTitle: 'Edit own profile',
    },
};

// SETTING ROUTE
const setting = {
    component: {
        typeMainSetting: {
            security: 'Security and login',
            personalInfo: 'Personal information',
            aboutFindme: 'About us',
            extend: 'Extend setting',
            logOut: 'Log out',
        },
        typeDetailSetting: {
            changePass: 'Change password',
            userBlocked: 'User blocked',
            theme: 'Theme',
            language: 'Language',
        },
    },
    settingScreen: {
        headerTitle: 'Setting',
    },
    securityAndLogin: {
        headerTitle: 'Security and login',
        nowPass: 'Current password',
        newPass: 'New password',
        confirmPass: 'Confirm password',
        buttonChangePass: 'Confirm',
    },
    personalInfo: {
        headerTitle: 'Personal information',
        notYet: 'Not yet',
        alertCfChange:
            'Are you sure want to change your {{type}} information ?',
        yes: 'Yes',
        no: 'No',
    },
    extendSetting: {
        headerTitle: 'Extend setting',
    },
    aboutUs: {
        headerTitle: 'About Findme',
    },
};

// ALERT
const alert = {
    // FOR LOGIN
    notNull: 'This is a required field !',
    passConfirmFalse: 'Password confirm is false !',
    emailNotValid: 'Email  not valid !',
    wantToSave: 'Do you want to save login for this account ?',

    // FOR DISCOVERY
    clickHeartModeExp: 'Finding hobby chat is only used when you logged in !',
    clickPlusModeExp: 'Create bubble chat only used when you logged in !',
    moreButtonContent: 'Go to Sign up',

    // FOR SETTING
    nowPassError: 'Current password not true !',
    successChangePass: 'Changing password successful !',
    successChange: 'Changing successfully !',

    // STYLE INPUT FORM
    notWrapProvider: 'You must wrap provider in this form',
    require: 'This is a required field',
    minLength: 'Please enter from {{min}} to {{max}} characters',
    regexPass: 'Can only contain characters and numbers',
    passNotMatch: 'Password not match',
    inValidEmail: 'Invalid email',
    inValidPhone: 'Invalid phone number',
};

const en = {
    login,
    alert,
    discovery,
    mess,
    profile,
    setting,
};
export default en;
