export enum infoType {
    facebook = 'facebook',
    email = 'email',
    phone = 'phone',
    gender = 'gender',
    birthday = 'birthday',
}

export enum genderType {
    man = 'Man',
    woman = 'Woman',
    notToSay = 'NotToSay', // must the same as sql
}

export enum themeType {
    darkTheme = 'darkTheme',
    lightTheme = 'lightTheme',
}

export enum languageType {
    en = 'en',
    vi = 'vi',
}

export enum asyncType {
    firstTimeOpenApp = 'true',
    storageAcc = 'storageAcc',
    index = 'index',
    logged = 'logged',
    language = 'language',
}

export enum signUpType {
    facebook = 'facebook',
    email = 'email',
    phone = 'phone',
}

export enum retrievePassType {
    username = 'username',
    facebook = 'facebook',
    email = 'email',
    phone = 'phone',
}

// setting
export enum typeDetailSetting {
    changePassword = 'changePassword',
    blockUser = 'blockUser',
    theme = 'theme',
    language = 'language',
}

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
