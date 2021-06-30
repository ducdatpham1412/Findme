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
            phone: 'Số điện thoại',
        },
        input: {
            header: 'Forgot password',
            username: 'Enter your username',
            email: 'Enter your email',
            phone: 'Enter your phone',
            sendOTP: 'Gửi mã OTP',
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
        noti: 'Giờ thì hãy tạo trang cá nhân của mình nào',
        listGender: 'Nam, Nữ, Không tiện nói',
        done: 'Ok đã xong',
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
        enjoyModeNoAcc: 'Trải nghiệm chế độ không tài khoản',
    },
};

// DISCOVERY ROUTE
const discovery = {
    component: {},
    heart: {
        headerTitle: 'Sở thích chat',
        done: 'Xong',
    },
    plus: {
        headerTitle: 'Bong bóng chat',
    },
    push: {},
    discoveryScreen: {
        searchHobbies: 'Tìm sở thích',
        searchChat: 'Tìm cuộc trò chuyện',
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
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Tin nhắn',
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
        typeDetailSetting: {
            changePass: 'Thay đổi mật khẩu',
            userBlocked: 'Chặn người dùng',
            theme: 'Chủ đề',
            language: 'Ngôn ngữ',
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
    },
    personalInfo: {
        headerTitle: 'Thông tin cá nhân',
        notYet: 'Chưa có',
        alertCfChange: 'Bạn chắc chắn muốn thay đổi {{type}} của mình chứ ?',
        yes: 'Có',
        no: 'Không',
    },
    extendSetting: {
        headerTitle: 'Cài đặt mở rộng',
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
};

const vi = {
    login,
    alert,
    discovery,
    mess,
    profile,
    setting,
};
export default vi;
