/* eslint-disable no-shadow */
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
    socialLoginAccount = 'socialLoginAccount',
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

// export enum CHAT_TAG {
//     newFromBubble = 0,
//     newFromProfile = 1,
//     group = 2,
// }
export enum MESSAGE_TYPE {
    text = 0,
    image = 1,
    sticker = 2,
    joinCommunity = 3,
    changeColor = 4,
    changeName = 5,
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
    deleteComment = '1.0.1',
    // chat tag
    createChatTag = '2.0',
    joinRoom = '2.1',
    leaveRoom = '2.2',
    changeChatName = '2.3',
    changeChatColor = '2.4',
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
    message = 0,
    comment = 1,
    follow = 2,
    likePost = 3,
    friendPostNew = 4,
    likeGroupBuying = 5,
    commentGroupBuying = 6,
}

export enum TYPE_BUBBLE_PALACE_ACTION {
    null = -1,
    createNewPost = 0,
    createNewGroupBuying = 0.5,
    editPostFromProfile = 1,
    scrollToTopDiscovery = 2,
    scrollToTopMyProfile = 3,
    archivePost = 4,
    unArchivePost = 5,
}

export enum TYPE_SOCIAL_LOGIN {
    facebook = 'facebook',
    google = 'google-oauth2',
    apple = 'apple',
}

export enum TYPE_OS_LOGIN_SOCIAL {
    android = 0,
    ios = 1,
}

export enum TYPE_DYNAMIC_LINK {
    post = 0,
    profile = 1,
    groupBuying = 2,
}

export enum CONVERSATION_STATUS {
    active = 1,
    stop = 0,
}

export enum FEELING {
    nice = 0,
    cute = 1,
    wondering = 2,
    cry = 3,
    angry = 4,
}

export enum TOPIC {
    travel = 0,
    cuisine = 1,
    shopping = 2,
}

export enum REACT {
    post = 0,
    comment = 1,
    message = 2,
}

export enum STATUS {
    notActive = 0,
    active = 1,
    draft = 2,
    archive = 3,
}

export enum POST_TYPE {
    review = 0,
    groupBuying = 1,
}

export enum ACCOUNT {
    user = 0,
    shop = 1,
}

export enum GROUP_BUYING_STATUS {
    deleted = 0,
    notJoined = 1,
    joinedNotBought = 2,
    bought = 3,
}

export enum FONT_FAMILY {
    avenirRegular = 'AvenirLTStd-Book',
    avenirBold = 'AvenirLTStd-Black',
    avenirRoman = 'AvenirLTStd-Roman',
    gtSuperRegular = 'GT Super Display Regular',
}

export enum SESSION {
    morning = 'morning',
    afternoon = 'afternoon',
    evening = 'evening',
}
