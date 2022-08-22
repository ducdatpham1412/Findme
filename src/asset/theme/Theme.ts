const Theme = {
    common: {
        white: 'white',
        black: '#333333',
        darkPink: '#EC1395',
        textMe: '#e4f0f4',
        comment: '#c5e3ff',
        commentGreen: '#3ACF37',
        gradientTabBar1: '#54B3E9',
        gradientTabBar2: '#31EDE2',
        blueInput: '#3E7BAC',
        blueInputHolder: '#A5C4CE',
        joinGroupChat: '#90BEE9',
        gray: '#99989B',
        grayLight: '#E5E5EA',
        background: '#F4F4F4',
        red: 'red',
        orange: 'orange',
    },
    darkTheme: {
        backgroundColor: '#081019',
        backgroundOpacity: (value = 0.6) => `rgba(8, 16, 25, ${value})`,
        backgroundColorSecond: '#0f1a23',
        textColor: '#9fcaed',
        textHightLight: '#c5e3ff',
        borderColor: '#5e8aa8',
        highlightColor: '#e8a02d',
        holderColor: '#162d42',
        holderColorLighter: '#114256',
        backgroundButtonColor: '#102a47',
        backgroundTextInput: '#202E44',
        tabBarIconColor: '#75adcb',
        likeHeart: '#DD0B0B',
        unLikeHeart: 'white',
        joinGroupChat: '#90BEE9',
    },
    lightTheme: {
        backgroundColor: '#ffffff',
        backgroundOpacity: (value = 0.6) => `rgba(255, 255, 255, ${value})`,
        backgroundColorSecond: '#f9f9f9',
        textColor: '#214d68',
        textHightLight: '#102a47',
        borderColor: '#2b6189',
        highlightColor: '#e89721',
        holderColor: '#d3d3d3',
        holderColorLighter: '#a5c4ce',
        backgroundButtonColor: '#c5e3ff',
        backgroundTextInput: '#cbe1ef',
        tabBarIconColor: '#102a47',
        likeHeart: '#DD0B0B',
        unLikeHeart: '#102a47',
        joinGroupChat: '#90BEE9',
    },
};

export default Theme;
