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
    next: 'Next',
    done: 'Done',
    save: 'Save',
    canNotSave: 'Can not save',
    success: 'Success',
    seeMore: '...See more',
    seeLess: '...See less',
    letGo: "Let's go",
    continue: 'Continue',
    reply: 'Reply',
    anonymous: '@Anonymous',
};

const login = {
    component: {
        sendOTP: {
            header: 'Confirm OTP',
            enterCode: 'Enter',
            confirmButton: 'Confirm',
            sendAgain: 'Re-send ({{countdown}})',
            sendAgainNoCount: 'Re-send',
            notiOTP: 'Please enter verification code Doffy have sent to',
        },
    },
    forgetPassword: {
        type: {
            header: 'Forgot password',
            chooseMethod: 'Choose method restoring password',
            user: 'Username',
            username: 'Enter your email',
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
            enterEmail: 'Email',
            enterPhone: 'Phone number',
        },
        hadReadAndAgree: 'I have read and agree to',
        doffyTermsAndPolicy: 'Terms Of Use',
    },
    detailInformation: {
        title: 'Edit information',
        man: 'Male',
        woman: 'Female',
        notToSay: 'Prefer not to say',
        firstChooseGender: 'First, choose your gender:',
        enterYourName: 'Enter your name:',
        chooseBirthday: 'Choosing birthday',
    },
    loginScreen: {
        slogan: 'Chat and find interesting friends',
        username: 'Email',
        password: 'Password',
        keepSignIn: 'Keep sign in',
        signIn: 'Sign in',
        byLoginOrTappingEnjoy:
            'By logging in or tapping "Enjoy without account",\nyou agree to our',
        termsOfUse: 'Terms Of Use',
        learnMore: '. Learn more about how we process your data in our',
        privacyPolicy: 'Privacy Policy',
        yourAccountIsBeingLock:
            'Your account is temporarily locked.\nBy tapping Continue, you confirm unlock your account.',
        continue: 'Continue',
        openAccountSuccess: 'Open account successfully!',
    },
    agreeTermOfService: {
        registerSuccess: 'Register successfully',
        agreeTermOfService: "Let's go",
        contentSuggest:
            'Register successfully! 🥰\nNow let’s go editting your profile',
    },
    enjoy: 'Enjoy',
    login: 'Login',
    register: 'Sign up',
    enjoyModeNoAcc: 'Enjoy app without account',
    forgotPassword: 'Forgot password?',
    orSignIn: 'Sign in with:',
};

// DISCOVERY ROUTE
const discovery = {
    component: {},
    heart: {
        headerTitle: 'Chat hobbies',
    },
    discoveryScreen: {
        searchHobbies: 'Find hobbies',
        searchChat: 'Find chat',
        personal: 'Personal',
        community: 'Community',
    },
    bubble: {
        startChat: 'Start chat now',
        goToSignUp: 'Go to login so you can start chatting with everyone',
        joinCommunity: 'Join community',
        goToConversation: 'Go to conversation',
    },
    report: {
        title: 'Report',
        chooseReason: '※ Choose a reason for report this user:',
        offensiveLanguage: 'Profanity, offensive language',
        dangerousAction: 'Dangerous behavior that threatens me or peole',
        spamRuining: 'Spam keeps ruining my experience',
        insultToMe: 'Insult to my personal honor',
        otherReason: 'Others',
        detailDescription: 'Detailed description:',
        uploadImage: 'If possible, send us some pictures:',
        sendReport: 'Send report',
        reportHadSent:
            'Your report has been sent\nWe will review this report and the denounced user for timely handling measures\n\nThank you for joining hands for a better Doffy community\n\nBest regards!\nDoffy Co.',
    },
    numberComments: '{{numberComments}} comments',
    seeDetailImage: 'Watch image',
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Messages',
        requestPublic:
            'Do you agree to unlock anonymous of this conversation?\n\nAfter unlocking, you and this friend can know and follow each other!',
        waitingOther: 'Waiting response from\nyour friend...',
        areYouReady: 'Are you ready? :D',
        congratulation:
            'Congratulation! :D\nNow you can connect and make friend to each other',
    },
    detailSetting: {
        profile: 'profile',
        stopConversation: 'Stop chat',
        openConversation: 'Open chat',
        block: 'Block',
        unBlock: 'Unblock',
        sureBlock:
            'Are you sure block this person?\n\nNote: Any chats with this person (both of anonymous or not) will be blocked',
        report: 'Report',
    },
    typing: 'typing',
    hadJoinGroup: 'had joined group',
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
        confirmButton: 'Update',
        name: 'Your name',
        anonymousName: 'Anonymous name',
    },
    screen: {
        sendMessage: 'Send message',
        follow: 'Follow',
        unFollow: 'Unfollow',
        goToChatTag: 'Go to conversation',
        confirmDeleteGroup:
            "After deleting, people won't see and join your group\nAre you sure delete?",
    },
    modalize: {
        setting: 'Setting',
        myInfo: 'My information',
        block: 'Block',
        report: 'Report',
    },
    post: {
        title: 'Post your image',
        caption: 'Write caption',
        post: 'Post',
        edit: 'Edit',
        editPost: 'Edit post',
        delete: 'Delete',
        sureDeletePost: 'Are you sure delete this post?',
        enterTopic: 'Enter topic yourself',
    },
    follow: {
        follower: 'Followers',
        following: 'Followings',
        follow: 'Follow',
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
        lockAccount: 'Lock my account',
        areYouSureLockAccount:
            'Are you sure to lock your account?\nAfter locking, all information on your profile will not be visible to anyone, and people will not be able to message you anymore.\n\nYou can open your account by logging in again.',
        continueLock: 'Continue locking',
        deleteAccount: 'Delete my account',
        areYouSureDeleteAccount:
            'Are you sure to delete your account?\nAfter tapping Continue deleting, your account will be temporarily locked for 20 days, you can still reactivate your account during the above time.\n\nOtherwise, after the above time, all your information including email, personal information will be deleted from our system.',
        continueDelete: 'Continue deleting',
    },
    personalInfo: {
        headerTitle: 'Personal information',
        enterPassword: 'Enter password',
        password: 'Password',
        notYet: 'Not yet',
        alertCfChange: 'Are you sure want to change this information?',
        confirm: 'Confirm',
        passwordNotTrue: 'Password not true !',
    },
    extendSetting: {
        headerTitle: 'Extend setting',
        theme: 'Theme',
        language: 'Language',
    },
    aboutUs: {
        headerTitle: 'About us',
        privacyPolicy: 'Privacy Policy',
        termsOfUse: 'Terms of use',
        contactUs: 'Contact us',
        feedback: 'Feedback box',
    },
    userGuide: {
        title: 'User guide',
    },
};

// NOTIFICATION
const notification = {
    title: 'Notifications',
};

// ALERT
const alert = {
    // FOR LOGIN
    notNull: 'This is a required field !',
    passConfirmFalse: 'Password confirm is false !',
    emailNotValid: 'Email  not valid !',
    wantToSave: 'Do you want to save account for login later?',
    loginFail: 'Login Fail',
    wantToChange: 'Want to change ?',

    // FOR DISCOVERY
    clickHeartModeExp: 'Finding hobby chat is only used when you logged in !',
    clickPlusModeExp: 'Create bubble chat only used when you logged in !',
    moreButtonContent: 'Go to Sign up',

    // FOR SETTING
    nowPassError: 'Current password not true !',
    successChangePass: 'Changed password successful !',
    successChange: 'Changed successfully !',

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
    permissionCamera: 'Access camera',
    permissionMicro: 'Access microphone',
    permissionPhoto: 'Access photo library',
};

const en = {
    common,
    alert,
    login,
    discovery,
    mess,
    profile,
    setting,
    notification,
};

export default en;
