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
    editGroupBuying = 0.6,
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
    camping = 0,
    volunteer = 1,
    teamBuilding = 2,
    food = 3,
    culture = 4,
    green = 5,
    sightseeing = 6,
    all = 7,
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
    openSans = 'OpenSans',
}

export enum SESSION {
    morning = 'morning',
    afternoon = 'afternoon',
    evening = 'evening',
}

export enum ERROR_KEY_ENUM {
    init_err = 0,

    // common
    value_blank = 0.1,
    value_wrong_format = 0.1,
    password_not_match = 0.3,
    otp_invalid = 0.4,
    password_invalid = 0.5,
    old_password_not_true = 0.6,

    // authentication
    register_fail = 1.1,
    username_existed = 1.2,
    email_existed = 1.3,
    phone_existed = 1.4,
    login_fail = 1.5,
    token_expired = 1.6,
    token_blacklisted = 1.7,
    username_not_exist = 1.8,
    login_facebook_failed = 1.9,
    had_requested_upgrade = 1.1,
    you_have_lock_your_account = 1.11,
    you_are_not_admin = 1.12,

    // setting
    you_have_blocked_this_person = 2.1,
    you_not_block_this_person = 2.2,

    // profile
    your_have_follow_this_person = 3.1,
    you_have_liked_this_post = 3.2,
    you_not_liked_this_post = 3.3,
    post_not_existed = 3.4,
    had_saved_this_post = 3.5,
    have_joined_group_buying = 3.6,
    not_joined_group_buying = 3.7,
    bought_group_buying = 3.8,
    group_buying_out_of_date = 3.9,

    // chat
    not_have_permission_delete_message = 4.1,
    conversation_not_existed = 4.2,
}
