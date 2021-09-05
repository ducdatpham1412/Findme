export enum infoType {
    facebook = 'facebook',
    email = 'email',
    phone = 'phone',
    gender = 'gender',
    birthday = 'birthday',
}

export enum RELATIONSHIP {
    self = 0,
    notFollowing = 1,
    following = 2,
    block = 3,
    friend = 4,
    notKnow = 10,
}

export enum GENDER_TYPE {
    man = 0,
    woman = 1,
    notToSay = 2,
}

export enum themeType {
    darkTheme = 0,
    lightTheme = 1,
}

export enum languageType {
    en = 0,
    vi = 1,
}

export enum asyncType {
    firstTimeOpenApp = 'true',
    storageAcc = 'storageAcc',
    activeUser = 'activeUser',
    index = 'index',
    // logged = 'logged',
    language = 'language',
}

// authentication
export enum signUpType {
    facebook = 0,
    email = 1,
    phone = 2,
}

export enum retrievePassType {
    username = 0,
    facebook = 1,
}

export enum TYPE_OTP {
    register = 0,
    resetPassword = 1,
    changeInfo = 2,
}

// setting

// socket
export enum eventSocket {
    authenticate = 'authenticate',
    unauthorized = 'unauthorized',
    authenticated = 'authenticated',
    connect = 'connect',
    reconnect = 'reconnect',
}

// message
export enum typeMessage {
    text = 1,
    image = 2,
}
export enum CHAT_TAG {
    newFromBubble = 0,
    newFromProfile = 1,
}

export enum SOCKET_EVENT {
    authenticate = '0',
    is_authenticated = '1',
    un_authorized = '2',
    chatTag = '2',
    message = '3',
    bubble = '4',
}
