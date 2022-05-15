export enum INFO_TYPE {
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

export enum RELATIONSHIP_GROUP {
    self = 0,
    joined = 1,
    notJoined = 2,
}

export enum GENDER_TYPE {
    man = 0,
    woman = 1,
    notToSay = 2,
}

export enum THEME_TYPE {
    darkTheme = 0,
    lightTheme = 1,
}

export enum LANGUAGE_TYPE {
    en = 0,
    vi = 1,
}

export enum ASYNC_TYPE {
    firstTimeOpenApp = 'true',
    storageAcc = 'storageAcc',
    activeUser = 'activeUser',
    index = 'index',
    // logged = 'logged',
    language = 'language',
}

// authentication
export enum SIGN_UP_TYPE {
    facebook = 0,
    email = 1,
    phone = 2,
    apple = 3,
}

export enum RETRIEVE_PASSWORD_TYPE {
    username = 0,
    facebook = 1,
}

export enum TYPE_OTP {
    register = 0,
    resetPassword = 1,
    changeInfo = 2,
    requestOpenAccount = 3,
}

export enum CHAT_TAG {
    newFromBubble = 0,
    newFromProfile = 1,
    group = 2,
}
export enum MESSAGE_TYPE {
    text = 0,
    image = 1,
    sticker = 2,
}

export enum SOCKET_EVENT {
    // authenticate
    authenticate = '0.0',
    authenticateEnjoy = '0.1',
    unauthorized = '0.2',
    appActive = '0.3',
    appBackground = '0.4',
    // bubble
    addComment = '1.0',
    joinCommunity = '1.1',
    // chat tag
    createChatTag = '2.0',
    joinRoom = '2.1',
    leaveRoom = '2.1.1',
    requestPublicChat = '2.2',
    agreePublicChat = '2.3',
    allAgreePublicChat = '2.4',
    changeGroupName = '2.5',
    changeChatColor = '2.6',
    // message
    message = '3.0',
    messageEnjoy = '3.1',
    seenMessage = '3.2',
    deleteMessage = '3.3',
    typing = '3.4',
    unTyping = '3.5',
    // block or stop conversation
    isBlocked = '4.0',
    unBlocked = '4.1',
    stopConversation = '4.3',
    openConversation = '4.4',
    // notification
    notification = '5.0',
}

export enum TYPE_FOLLOW {
    follower = 0,
    following = 1,
}

export enum TYPE_COLOR {
    talking = 1,
    movie = 2,
    technology = 3,
    gaming = 4,
    animal = 5,
    travel = 6,
    fashion = 7,
    other = 8,
}

export enum TYPE_NOTIFICATION {
    newChatTag = 0,
    follow = 1,
    likePost = 2,
    friendPostNew = 3,
    comment = 4,
    message = 5,
}

export enum TYPE_BUBBLE_PALACE_ACTION {
    disableBubble = 0,
    createNewPostFromProfile = 1,
    editPostFromProfile = 2,
    createNewGroupFromProfile = 3,
    editGroupFromProfile = 4,
}
