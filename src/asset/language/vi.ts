const common = {
    yes: 'Có',
    no: 'Không',
    imageUpload: {
        selected: 'Chọn',
        cancel: 'Huỷ',
    },
    // option image picker
    chooseFromLibrary: 'Chọn từ thư viện',
    chooseFromCamera: 'Chụp ảnh',
    cancel: 'Huỷ',
    next: 'Tiếp',
    done: 'Xong',
    save: 'Lưu',
    canNotSave: 'Không thể lưu',
    success: 'Thành công',
    seeMore: '...Xem thêm',
    seeLess: '...Ẩn bớt',
    letGo: 'Đi thôi',
    continue: 'Tiếp tục',
    reply: 'Trả lời',
    anonymous: '@Ẩn danh',
    writeSomething: 'Viết gì đó',
    discard: 'Bỏ đi',
    stay: 'Ở lại',
    wantToDiscard: 'Bạn muốn bỏ những thay đổi vừa rồi?',
    null: '',
};

const login = {
    component: {
        sendOTP: {
            header: 'Xác nhận OTP',
            enterCode: 'Nhập mã',
            confirmButton: 'Xác nhận',
            sendAgain: 'Gửi lại ({{countdown}})',
            sendAgainNoCount: 'Gửi lại',
            notiOTP: 'Vui lòng nhập mã xác minh Doffy đã gửi đến',
        },
    },
    forgetPassword: {
        type: {
            header: 'Quên mật khẩu',
            chooseMethod: 'Chọn cách thức khôi phục mật khẩu',
            user: 'Tên đăng nhập',
            username: 'Nhập email của bạn',
            continue: 'Tiếp tục',
            comeToFacebook: 'Đi tới facebook',
        },
        send: {
            header: 'Quên mật khẩu',
            receiveThrow: 'Nhận OTP qua',
            phone: 'Số điện thoại',
        },
        form: {
            header: 'Đặt lại mật khẩu',
            newPass: 'Mật khẩu mới',
            confirmPass: 'Xác nhận mật khẩu',
            buttonDone: 'Đã xong',
        },
    },
    signUp: {
        type: {
            header: 'Đăng ký',
            chooseMethod: 'Chọn cách thức đăng ký tài khoản',
            phone: 'Số điện thoại',
            nameHolder: 'Tên Findme',
        },
        form: {
            header: 'Đăng ký',
            username: 'Tên đăng nhập',
            password: 'Mật khẩu',
            confirmPass: 'Xác nhận mật khẩu',
            confirmButton: 'Xác nhận',
            enterEmail: 'Email',
            enterPhone: 'Số điện thoại',
        },
        hadReadAndAgree: 'Tôi đã đọc và đồng ý với',
        doffyTermsAndPolicy: 'Điều khoản sử dụng',
    },
    detailInformation: {
        title: 'Thông tin cá nhân',
        man: 'Nam',
        woman: 'Nữ',
        notToSay: 'Không tiện nói',
        firstChooseGender: 'Đầu tiên, chọn giới tính của bạn',
        enterYourName: 'Nhập tên của bạn:',
        chooseBirthday: 'Chọn ngày sinh',
    },
    loginScreen: {
        slogan: 'Trò chuyện và tìm những người bạn thú vị',
        username: 'Email',
        password: 'Mật khẩu',
        keepSignIn: 'Duy trì đăng nhập',
        signIn: 'Đăng nhập',
        byLoginOrTappingEnjoy:
            'Bằng việc đăng nhập hoặc sử dụng "Trải nghiệm không tài khoản", bạn đồng ý với',
        termsOfUse: 'Điều khoản sử dụng',
        learnMore:
            ' của chúng tôi. Hiểu về cách chúng tôi xử lý dữ liệu của bạn tại',
        privacyPolicy: 'Chính sách bảo mật',
        yourAccountIsBeingLock:
            'Tài khoản của bạn đang khoá tạm thời.\nBằng việc ấn Tiếp tục, bạn xác nhận mở khoá tài khoản của mình.',
        continue: 'Tiếp tục',
        openAccountSuccess: 'Mở khoá tài khoản thành công!',
    },
    agreeTermOfService: {
        registerSuccess: 'Đăng ký thành công',
        agreeTermOfService: 'Đi thôi',
        contentSuggest:
            'Đăng ký thành công! 🥰\nBây giờ chúng ta hãy bắt đầu chỉnh sửa hồ sơ của bạn',
    },
    enjoy: 'Trải nghiệm',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    enjoyModeNoAcc: 'Trải nghiệm app không dùng tài khoản',
    forgotPassword: 'Quên mật khẩu?',
    orSignIn: 'Đăng nhập với:',
};

// DISCOVERY ROUTE
const discovery = {
    heart: {
        headerTitle: 'Sở thích chat',
    },
    discoveryScreen: {
        searchHobbies: 'Tìm sở thích',
        searchChat: 'Tìm cuộc trò chuyện',
        personal: 'Cá nhân',
        community: 'Cộng đồng',
    },
    bubble: {
        startChat: 'Bắt chuyện ngay',
        goToSignUp:
            'Đi tới đăng nhập để có thể bắt đầu trò chuyện với mọi người nhé',
        joinCommunity: 'Tham gia nhóm',
        goToConversation: 'Đi tới trò chuyện',
    },
    report: {
        title: 'Tố cáo',
        reportPerson: 'Tố cáo {{name}}',
        chooseReason: '※ Chọn một lý do để tố cáo người dùng này:',
        offensiveLanguage: 'Ngôn từ tục tĩu, gây xúc phạm',
        dangerousAction: 'Hành vi nguy hiểm, đe doạ tới tôi hoặc mọi người',
        spamRuining: 'Liên tục spam, ảnh hưởng tới trải nghiệm cá nhân',
        insultToMe: 'Bôi nhọ danh dự cá nhân người khác',
        otherReason: 'Khác',
        detailDescription: 'Mô tả chi tiết:',
        uploadImage: 'Nếu có thể, hãy gửi cho chúng tôi một số hình ảnh',
        sendReport: 'Gửi tố cáo',
        reportHadSent:
            'Tố cáo của bạn đã được gửi đi\nChúng tôi sẽ xem xét đối với tố cáo của bạn và người dùng bị tố cáo để có những biện pháp xử lý kịp thời\n\nCám ơn bạn đã chung tay vì một cộng đồng Doffy ngày càng tốt hơn\n\nTrân trọng!\nDoffy Co.',
    },
    seeDetailImage: 'Xem ảnh',
    share: {
        title: 'Chia sẻ',
    },
    all: 'Tất cả',
    like: 'Thả sao',
    numberLike: '{{value}} sao',
    comment: 'Bình luận',
    numberComments: '{{numberComments}} bình luận',
    chooseTopic: 'Chủ đề yêu thích',
    applicationPeriod: 'Thời gian áp dụng',
    groupBuyingPrice: 'Bảng giá mua chung',
    numberPeople: '{{value}} người',
    joinGroupBuying: 'Tham gia mua chung',
    joined: 'Đã tham gia',
    unJoinGroupBuying: 'Rời mua chung',
    numberPeopleJoin: '{{value}} người đã tham gia mua chung',
    bought: 'Đã mua',
    confirmBought: 'Xác nhận đã mua',
    participators: '{{value}} người tham gia',
    gbExpired: 'Chiến dịch mua chung đã hết hạn',
};

// REPUTATION
const reputation = {
    topReviewer: 'Top reviewers',
    yourRank: 'Thứ hạng của bạn: {{value}}',
};

// PROFILE SCREEN
const profile = {
    component: {
        infoProfile: {
            follower: 'Người theo dõi',
            following: 'Đang theo dõi',
            introduce:
                'Đăng ký tài khoản để trải nghiệm các năng chat và tạo trang cá nhân của riêng mình nhé !',
            tellSignUp: 'Đi tới đăng ký',
            editProfile: 'Trang cá nhân',
        },
        searchAndSetting: 'Tìm những người khác',
    },
    edit: {
        confirmButton: 'Cập nhật',
        name: 'Tên hiển thị',
        anonymousName: 'Tên ẩn danh',
    },
    screen: {
        sendMessage: 'Gửi tin nhắn',
        follow: 'Theo dõi',
        unFollow: 'Huỷ theo dõi',
        goToChatTag: 'Đi tới cuộc trò chuyện',
        confirmDeleteGroup:
            'Sau khi xoá, mọi người sẽ không thấy và tham gia nhóm của bạn nữa\nBạn vẫn chắc chắn xoá chứ?',
    },
    modalize: {
        setting: 'Cài đặt',
        myInfo: 'Thông tin của tôi',
        block: 'Chặn',
        report: 'Tố cáo',
    },
    post: {
        title: 'Đăng ảnh',
        caption: 'Cảm nghĩ',
        post: 'Tải lên',
        draft: 'Lưu nháp',
        edit: 'Chỉnhh sửa',
        archive: 'Tạm ẩn',
        unArchive: 'Hiện lại bảng tin',
        delete: 'Xoá',
        sureDeletePost: 'Bạn chắc chắn muốn xoá\nbức ảnh này chứ?',
        enterTopic: 'Tự nhập chủ đề',
        pickImage: 'Chọn ảnh',
        addLink: 'Thêm link',
        feeling: 'Cảm xúc',
        checkIn: 'Check in',
        topic: 'Chủ đề review',
        rating: 'Đánh giá',
        pasteLink: 'Dán đường dẫn URL',
        whereAreYouNow: 'Bạn đang ở đâu?',
        willDebutSearchOnGoogleMap:
            'Doffy đang phát triển tính năng tìm địa chỉ trên Google map\nBạn đợi xíu nhaaa^^',
        nice: 'Tốt',
        cute: 'Cute',
        wondering: 'Phân vân',
        cry: 'Khóc',
        angry: 'Tức giận',
        travel: 'Du lịch',
        cuisine: 'Ẩm thực',
        shopping: 'Mua sắm',
    },
    follow: {
        follower: 'Người theo dõi',
        following: 'Đang theo dõi',
        follow: 'Theo dõi',
    },
    removeAvatar: 'Xoá ảnh',
    draftPost: 'Bài nháp',
    thisPostInDraft: 'Bạn đang lưu nháp bài này',
    goToPost: 'Đi tới đăng bài',
    reviewProvider: 'Review nhà cung cấp',
    postsArchived: 'Bài viết lưu trữ',
    upgradeAccount: 'Chế độ nhà cung cấp',
    groupBuyingJoined: 'Mua chung đã tham gia',
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Tin nhắn',
        requestPublic:
            'Bạn đồng ý mở khóa ẩn danh của cuộc trò chuyện này chứ?\n\nSau khi mở khoá, bạn và người bạn này có thể biết và theo dõi với nhau!',
        waitingOther: 'Đợi phản hồi từ người bạn bên kia...',
        areYouReady: 'Sẵn sàng chưa? :D',
        congratulation:
            'Wowww! :D\nGiờ đây các bạn có thể chia sẻ và kết bạn với nhau rồi',
    },
    detailSetting: {
        title: 'Chi tiết trò chuyện',
        profile: 'Trang cá nhân của {{name}}',
        theme: 'Màu sắc',
        conversationName: 'Tên cuộc trò chuyện',
        stopConversation: 'Dừng chat',
        openConversation: 'Mở chat',
        block: 'Chặn',
        report: 'Tố cáo',
    },
    typing: 'typing',
    hadJoinGroup: 'vừa tham gia nhóm',
    changeColorOfChat: '{{name}} đã thay đổi màu sắc cuộc trò chuyện',
    changeNameOfChat: '{{name}} đã thay đổi tên cuộc trò chuyện',
    editConversationName: 'Tên cuộc trò chuyện',
    oneNameForBoth: 'Sử dụng một tên cho cả hai bạn',
};

// SETTING ROUTE
const setting = {
    component: {
        typeMainSetting: {
            security: 'Bảo mật và đăng nhập',
            personalInfo: 'Thông tin cá nhân',
            aboutFindme: 'Về chúng tôi',
            extend: 'Cài đặt mở rộng',
            logOut: 'Đăng xuất',
        },
    },
    settingScreen: {
        headerTitle: 'Cài đặt',
    },
    securityAndLogin: {
        headerTitle: 'Bảo mật và đăng nhập',
        nowPass: 'Mật khẩu hiện tại',
        newPass: 'Mật khẩu mới',
        confirmPass: 'Xác nhận mật khẩu',
        buttonChangePass: 'Xác nhận',
        changePass: 'Thay đổi mật khẩu',
        userBlocked: 'Chặn người dùng',
        lockAccount: 'Khoá tài khoản',
        areYouSureLockAccount:
            'Bạn chắc chắn khoá tài khoản của mình chứ?\nSau khi khoá, mọi thông tin trên trang cá nhân của bạn sẽ không hiển thị với bất cứ ai, mọi người cũng không thể nhắn tin với bạn nữa.\n\nBạn có thể mở khoá tài khoản của mình bằng cách đăng nhập lại.',
        continueLock: 'Tiếp tục khoá',
        deleteAccount: 'Xoá tài khoản',
        areYouSureDeleteAccount:
            'Bạn chắc chắn muốn xoá tài khoản của mình chứ?\nSau khi ấn Tiếp tục xoá, tài khoản của bạn sẽ tạm thời bị khóa trong vòng 20 ngày, bạn vẫn có thể tái kích hoạt tài khoản của mình trong thời gian trên.\n\nNếu không, sau thời gian trên, tất cả thông tin của bạn bao gồm email, thông tin cá nhân sẽ bị xóa khỏi hệ thống.',
        continueDelete: 'Tiếp tục xoá',
    },
    personalInfo: {
        headerTitle: 'Thông tin cá nhân',
        enterPassword: 'Nhập mật khẩu',
        password: 'Mậu khẩu',
        notYet: 'Chưa có',
        alertCfChange:
            'Bạn chắc chắn muốn thay đổi thông tin này của mình chứ?',
        confirm: 'Xác nhận',
        passwordNotTrue: 'Mật khẩu không đúng !',
    },
    extendSetting: {
        headerTitle: 'Cài đặt mở rộng',
        theme: 'Giao diện',
        language: 'Ngôn ngữ',
    },
    aboutUs: {
        headerTitle: 'Về chúng tôi',
        privacyPolicy: 'Chính sách bảo mật',
        termsOfUse: 'Điều khoản sử dụng',
        contactUs: 'Liên hệ chúng tôi',
        feedback: 'Hòm thư góp ý',
    },
    userGuide: {
        title: 'Hướng dẫn sử dụng',
    },
};

// NOTIFICATION
const notification = {
    title: 'Thông báo',
    comment: ' đã bình luận bài của bạn',
    follow: ' bắt đầu theo dõi bạn',
    likePost: ' thích bài đăng của bạn',
    friendPostNew: ' vừa đăng một bài mới',
};

// ALERT
const alert = {
    // FOR LOGIN
    notNull: 'Giá trị không được để trống !',
    passConfirmFalse: 'Mật khẩu xác nhận\nkhông đúng !',
    emailNotValid: 'Email không hợp lệ !',
    wantToSave: 'Bạn muốn giữ trạng thái đăng nhập cho lần sau chứ?',
    loginFail: 'Đăng nhập thất bại',
    wantToChange: 'Xác nhận thay đổi',

    // FOR DISCOVERY
    clickHeartModeExp:
        'Tìm sở thích chat chỉ có thể sử dụng khi đăng nhập tài khoản !',
    clickPlusModeExp:
        'Tạo bong bóng chat chỉ có thể sử dụng khi đăng nhập tài khoản !',
    moreButtonContent: 'Đi tới đăng ký',

    // FOR SETTING
    nowPassError: 'Mật khẩu hiện tại không đúng !',
    successChangePass: 'Thay đổi mật khẩu thành công !',
    successChange: 'Thay đổi thành công !',

    // STYLE INPUT FORM
    notWrapProvider: 'You must wrap provider in this form',
    require: 'Giá trị bắt buộc điền',
    minLength: 'Chỉ nhập từ {{min}} tới {{max}} ký tự',
    regexPass: 'Chỉ bao gồm chữ cái và số',
    passNotMatch: 'Mật khẩu không trùng khớp',
    inValidEmail: 'Email không đúng định dạng',
    inValidPhone: 'Số điện thoại không đúng',

    // PROFILE
    successUpdatePro: 'Cập nhật trang cá nhân thành công !',
    invalidLink: 'Đường dẫn URL không hợp lệ',

    // PERMISSION
    permissionCamera: 'Cho phép Doffy truy cập vào máy ảnh',
    permissionMicro: 'Cho phép Doffy truy cập vào micro',
    permissionPhoto: 'Cho phép Doffy truy cập vào thư viện ảnh',
};

const vi = {
    common,
    login,
    alert,
    discovery,
    mess,
    profile,
    setting,
    notification,
    reputation,
};
export default vi;
