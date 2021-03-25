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
        avatar: 'https://scontent.fhan3-1.fna.fbcdn.net/v/t1.6435-9/104774014_2789100984653499_4396713680184081828_n.jpg?_nc_cat=102&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=vqWY-GhIOdMAX8PhMDh&_nc_oc=AQlbyTt3NHjQOA6_J9dV_lNVoFChkVGyyJE4RIQLcZAf0_gEdhti5siwj98iuAL3FEI&_nc_ht=scontent.fhan3-1.fna&oh=6a23abd05cf9fd1634bcfb7c452359f5&oe=60D26210',
        cover: 'https://scontent.fhan3-1.fna.fbcdn.net/v/t31.18172-8/27500990_2092080781022193_3998095643133249671_o.jpg?_nc_cat=106&ccb=1-3&_nc_sid=e3f864&_nc_ohc=ZdWljRoinQQAX9An5vC&_nc_ht=scontent.fhan3-1.fna&oh=2a459eef4946d38a54c477dd6e5cfddc&oe=60D4A1C0',
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
