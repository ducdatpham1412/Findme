export const listUserBlock = [
    {
        id: 1,
        image: '',
        name: 'One',
    },
    {
        id: 2,
        image: '',
        name: 'Two',
    },
    {
        id: 3,
        image: '',
        name: 'Three',
    },
];

export const getProfile = {
    info: {
        name: 'Duc Hehe',
        description: 'I want to fly',
        avatar: 'https://i.pinimg.com/564x/cf/e6/6c/cfe66c20d118d57ff423014e06e224b1.jpg',
        cover: 'https://i.pinimg.com/564x/f0/2b/7c/f02b7cfb45f282fd6b9c728beab45835.jpg',
        followers: 10,
        followings: 10,
        listPhotos: [
            {
                id: 1,
                image: 'https://i.pinimg.com/originals/76/67/fd/7667fd8aac79132e12f6a88eaa346263.jpg',
                caption: 'Co nang xinh dep',
            },
            {
                id: 2,
                image: 'https://i.pinimg.com/564x/69/f4/a0/69f4a07fb45eca74b80386ac5c58f24f.jpg',
                caption: 'Co nang xinh dep',
            },
            {
                id: 3,
                image: 'https://i.pinimg.com/564x/e3/75/eb/e375ebf74d86a603ae670c50e395733a.jpg',
                caption: 'Co nang xinh dep',
            },
        ],
        gender: 'Woman',
        birthday: new Date(2000, 11, 14),
    },
    theme: 'lightTheme',
    language: 'en',
    contact: {
        facebook: 'facebook',
        email: 'ducdat@gmail.com',
        phone: '0123456789',
    },
};

export const getListChat = [
    {
        id: 0,
        name: 'Duc Dat',
        avatar: 'https://i.pinimg.com/564x/b0/60/0b/b0600bd65c5243595b4afdc96424cc51.jpg',
        latestChat: 'Hello ban',
    },
    {
        id: 1,
        name: 'Jiso',
        avatar: 'https://i.pinimg.com/564x/6b/a3/98/6ba39832a1fb81494f556def8967038a.jpg',
        latestChat: 'Nguoi yeu hoi co biet anh nho em nhieu lam',
    },
];

export const listHobbies: Array<any> = [
    {
        id: 0,
        name: 'Basketball',
        icon: 'https://image.flaticon.com/icons/png/512/875/875149.png',
        liked: 1,
    },
    {
        id: 1,
        name: 'Coding',
        icon: 'https://image.flaticon.com/icons/png/512/875/875149.png',
        liked: 1,
    },
    {
        id: 2,
        name: 'Travelling',
        icon: 'https://image.flaticon.com/icons/png/512/875/875149.png',
        liked: 0,
    },
    {
        id: 3,
        name: 'Business',
        icon: 'https://image.flaticon.com/icons/png/512/875/875149.png',
        liked: 0,
    },
    {
        id: 4,
        name: 'Design',
        icon: 'https://image.flaticon.com/icons/png/512/875/875149.png',
        liked: 0,
    },
];

export const listBubbles = [
    {
        idHobby: 1,
        description: 'Lap trinh Python Ai',
    },
    // {
    //     idHobby: 3,
    //     description: 'Khoi nghiep Kawai',
    // },
];

export const resource = {
    listHobbies,
    listBubbles,
};
