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
    done: 'Xong',
    save: 'Lưu',
    success: 'Thành công',
};

const login = {
    component: {
        sendOTP: {
            header: 'Xác nhận OTP',
            enterCode: 'Nhập mã',
            confirmButton: 'Xác nhận',
            sendAgain: 'Gửi lại ({{countdown}})',
            notiOTP: 'Nhập mã OTP Findme gửi đến',
        },
    },
    forgetPassword: {
        type: {
            header: 'Quên mật khẩu',
            chooseMethod: 'Chọn cách thức khôi phục mật khẩu',
            user: 'Tên đăng nhập',
            username: 'Nhập tên đăng nhập',
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
            enterEmail: 'Nhập địa chỉ email',
            enterPhone: 'Nhập số điện thoại',
        },
    },
    detailInformation: {
        header: 'OK !',
        noti: 'Thông tin của tôi',
        man: 'Nam',
        woman: 'Nữ',
        notToSay: 'Không tiện nói',
        done: 'Đi thôi',
    },
    loginScreen: {
        slogan: 'Có những người đang chờ bạn',
        username: 'Tên đăng nhập',
        password: 'Mật khẩu',
        keepSignIn: 'Duy trì đăng nhập',
        forgotPass: 'Quên mật khẩu ?',
        signIn: 'Đăng nhập',
        notHaveAcc: 'Chưa có tài khoản?',
        signUp: ' Đăng ký',
        enjoyModeNoAcc: 'Trải nghiệm\nkhông tài khoản',
        goToLogin: 'Đi tới\nđăng nhập',
    },
    agreeTermOfService: {
        registerSuccess: 'Đăng ký thành công',
        agreeTermOfService: 'Xác nhận',
    },
};

// DISCOVERY ROUTE
const discovery = {
    component: {},
    heart: {
        headerTitle: 'Sở thích chat',
    },
    plus: {
        headerTitle: 'Bong bóng chat',
        holderDes: 'Thêm mô tả',
        create: 'Tạo',
        edit: 'Sửa',
        update: 'Cập nhật',
    },
    discoveryScreen: {
        searchHobbies: 'Tìm sở thích',
        searchChat: 'Tìm cuộc trò chuyện',
    },
    interactBubble: {
        enterMessage: 'Lời nhắn',
    },
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
            editProfile: 'Chỉnh sửa trang cá nhân',
        },
        searchAndSetting: 'Tìm những người khác',
    },
    edit: {
        headerTitle: 'Trang cá nhân',
        confirmButton: 'Cập nhật',
    },
    screen: {
        sendMessage: 'Gửi tin nhắn',
        follow: 'Theo dõi',
        unFollow: 'Huỷ theo dõi',
    },
    modalize: {
        setting: 'Cài đặt',
        myInfo: 'Thông tin của tôi',
        block: 'Chặn',
        report: 'Tố cáo',
    },
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Tin nhắn',
    },
    detailSetting: {
        profile: 'profile',
    },
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
    },
    personalInfo: {
        headerTitle: 'Thông tin cá nhân',
        notYet: 'Chưa có',
        alertCfChange: 'Bạn chắc chắn muốn thay đổi {{type}} của mình chứ ?',
    },
    extendSetting: {
        headerTitle: 'Cài đặt mở rộng',
        theme: 'Chủ đề',
        language: 'Ngôn ngữ',
    },
    aboutUs: {
        headerTitle: 'Về Findme',
    },
};

// ALERT
const alert = {
    // FOR LOGIN
    notNull: 'Giá trị không được để trống !',
    passConfirmFalse: 'Mật khẩu xác nhận\nkhông đúng !',
    emailNotValid: 'Email không hợp lệ !',
    wantToSave: 'Bạn muốn giữ trạng thái đăng nhập chứ ?',
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

    // PERMISSION
    permissionCamera: 'access camera',
    permissionMicro: 'access microphone',
    permissionPhoto: 'access photo library',
};

const vi = {
    common,
    login,
    alert,
    discovery,
    mess,
    profile,
    setting,
};
export default vi;
