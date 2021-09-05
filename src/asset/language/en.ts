const common = {
    yes: 'Yes',
    no: 'No',
    imageUpload: {
        selected: 'Selected',
        cancel: 'Cancel',
    },
    // option image picker
    chooseFromLibrary: 'Choose from library',
    chooseFromCamera: 'Open camera',
    cancel: 'Cancel',
    done: 'Done',
    save: 'Save',
    success: 'Success',
};

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
            username: 'Enter your username',
            continue: 'Continue',
            comeToFacebook: 'Come to facebook',
        },
        send: {
            header: 'Forgot password',
            receiveThrow: 'Receive OTP via',
            phone: 'Phone no',
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
        noti: 'My information',
        man: 'Man',
        woman: 'Woman',
        notToSay: 'Prefer not to say',
        done: "Let's go",
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
        enjoyModeNoAcc: 'Enjoy no account',
        goToLogin: 'Go to login',
    },
    agreeTermOfService: {
        registerSuccess: 'Register successfully',
        agreeTermOfService: 'Confirm',
    },
};

// DISCOVERY ROUTE
const discovery = {
    component: {},
    heart: {
        headerTitle: 'Chat hobbies',
    },
    plus: {
        headerTitle: 'Bubble chat',
        holderDes: 'Adding description',
        create: 'Create',
        edit: 'Edit',
        update: 'Update',
    },
    discoveryScreen: {
        searchHobbies: 'Find hobbies',
        searchChat: 'Find chat',
    },
    interactBubble: {
        enterMessage: 'Message',
    },
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Messages',
    },
    detailSetting: {
        profile: 'profile',
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
        confirmButton: 'Update',
    },
    screen: {
        sendMessage: 'Send message',
        follow: 'Follow',
        unFollow: 'Un follow',
    },
    modalize: {
        setting: 'Setting',
        myInfo: 'My information',
        block: 'Block',
        report: 'Report',
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
        changePass: 'Change password',
        userBlocked: 'User blocked',
    },
    personalInfo: {
        headerTitle: 'Personal information',
        notYet: 'Not yet',
        alertCfChange:
            'Are you sure want to change your {{type}} information ?',
    },
    extendSetting: {
        headerTitle: 'Extend setting',
        theme: 'Theme',
        language: 'Language',
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
    loginFail: 'Login Fail',
    wantToChange: 'Want to change ?',

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

    // PROFILE
    successUpdatePro: 'Update profile successful !',

    // PERMISSION
    permissionCamera: 'access camera',
    permissionMicro: 'access microphone',
    permissionPhoto: 'access photo library',
};

const en = {
    common,
    alert,
    login,
    discovery,
    mess,
    profile,
    setting,
};
export default en;
