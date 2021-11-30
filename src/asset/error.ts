export enum ERROR_KEY_ENUM {
    init_err = 0,

    // common
    value_blank = 1,
    value_wrong_format = 2,
    password_not_match = 3,
    otp_invalid = 4,
    password_invalid = 5,
    old_password_not_true = 6,

    // authentication
    register_fail = 7,
    username_existed = 8,
    email_existed = 9,
    login_fail = 10,
    token_expired = 11,
    token_blacklisted = 12,
    username_not_exist = 13,

    // setting
    you_have_blocked_this_person = 14,
    you_not_block_this_person = 15,

    // profile
    your_have_follow_this_person = 16,
}
