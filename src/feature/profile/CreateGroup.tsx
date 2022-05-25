import {
    TypeBubblePalace,
    TypeCreateGroupResponse,
    TypeCreatePostRequest,
} from 'api/interface';
import {apiCreateGroup, apiEditGroup} from 'api/module';
import {RELATIONSHIP, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ButtonBack from 'components/common/ButtonBack';
import IconHobby from 'feature/discovery/components/IconHobby';
import Redux from 'hook/useRedux';
import {appAlert, goBack, popUpPicker} from 'navigation/NavigationService';
import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {
    moderateScale,
    scale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import {Path, Svg} from 'react-native-svg';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    optionsImagePicker,
} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    route: {
        params: {
            itemGroupFromEdit?: TypeBubblePalace;
        };
    };
}

const CreateGroup = ({route}: Props) => {
    const itemGroupFromEdit = route.params?.itemGroupFromEdit;

    const {t} = useTranslation();

    const theme = Redux.getTheme();
    const profile = Redux.getPassport().profile;
    const isModeExp = Redux.getModeExp();
    const {listHobbies} = Redux.getResource();

    const actionSheetRef = useRef<any>(null);
    const scaleIconColor = useRef(new Animated.Value(1)).current;
    const scaleIconImage = useRef(new Animated.Value(1)).current;

    const [content, setContent] = useState(itemGroupFromEdit?.content || '');
    const [image, setImage] = useState(itemGroupFromEdit?.images[0] || '');
    const [color, setColor] = useState<number | undefined>(
        itemGroupFromEdit?.color,
    );
    const [name, setName] = useState(itemGroupFromEdit?.name || '');

    const optionsImgPicker = optionsImagePicker.map(text => t(text));

    const onConfirmPost = async () => {
        if (color === undefined) {
            Animated.spring(scaleIconColor, {
                toValue: 2.3,
                useNativeDriver: true,
                speed: 20,
            }).start(() => {
                Animated.spring(scaleIconColor, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 20,
                }).start();
            });
            return;
        }

        if (!image) {
            Animated.spring(scaleIconImage, {
                toValue: 2.3,
                useNativeDriver: true,
                speed: 20,
            }).start(() => {
                Animated.spring(scaleIconImage, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 20,
                }).start();
            });
            return;
        }

        /**
         * Edit post
         */
        if (itemGroupFromEdit) {
            Redux.setIsLoading(true);
            const updateData: TypeCreatePostRequest = {};
            if (content !== itemGroupFromEdit.content) {
                updateData.content = content;
            }
            if (image !== itemGroupFromEdit.images[0]) {
                const temp = await ImageUploader.upLoad(image, 1000);
                updateData.images = [temp];
            }
            if (color !== itemGroupFromEdit.color) {
                updateData.color = color;
            }
            if (name !== itemGroupFromEdit.name) {
                updateData.name = name;
            }

            try {
                if (!isModeExp) {
                    await apiEditGroup({
                        idGroup: itemGroupFromEdit.id,
                        data: updateData,
                    });
                }
                updateData.images = [image];
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editGroupFromProfile,
                    payload: {
                        id: itemGroupFromEdit.id,
                        ...updateData,
                    },
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }

            return;
        }

        /**
         * Create post
         */
        try {
            Redux.setIsLoading(true);

            if (!isModeExp) {
                const uploadImage = await ImageUploader.upLoad(image, 1000);
                const res = await apiCreateGroup({
                    content,
                    images: image ? [uploadImage] : [],
                    color,
                    name,
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewGroupFromProfile,
                    payload: res.data,
                });
            } else {
                const newPostGroup: TypeCreateGroupResponse = {
                    id: String(Math.random()),
                    content,
                    images: [image],
                    chatTagId: '',
                    creatorId: profile.id,
                    createdTime: String(new Date()),
                    color,
                    name,
                    relationship: RELATIONSHIP.self,
                };
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewGroupFromProfile,
                    payload: newPostGroup,
                });
            }

            goBack();
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    const onChooseAction = useCallback(async (index: number) => {
        if (index === 0) {
            await chooseImageFromCamera(setImage, {
                freeStyleCrop: true,
            });
        } else if (index === 1) {
            await chooseImageFromLibrary(setImage, {
                freeStyleCrop: true,
            });
        }
    }, []);

    const onNavigatePicker = useCallback(() => {
        popUpPicker({
            data: listHobbies,
            renderItem: (item: any) => {
                if (item.id === 8) {
                    return (
                        <View style={styles.elementPicker}>
                            <StyleImage
                                source={{uri: item.icon}}
                                customStyle={styles.iconPicker}
                            />
                            <StyleInput
                                defaultValue={''}
                                onChangeText={text => setName(text)}
                                containerStyle={styles.inputContainerPicker}
                                inputStyle={[
                                    styles.inputOther,
                                    {color: theme.textHightLight},
                                ]}
                                hasErrorBox={false}
                                hasUnderLine={false}
                                maxLength={50}
                                i18Placeholder="profile.post.enterTopic"
                                placeholderTextColor={theme.holderColorLighter}
                                isEffectTabBar={false}
                            />
                        </View>
                    );
                }
                return (
                    <View style={styles.elementPicker}>
                        <StyleImage
                            source={{uri: item.icon}}
                            customStyle={styles.iconPicker}
                        />
                        <StyleText
                            originValue={item.name}
                            customStyle={[
                                styles.textPicker,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                );
            },
            itemHeight: verticalScale(70),
            onSetItemSelected: (hobby: any) => {
                console.log('choosing: ', hobby);
                if (hobby.id === 8) {
                    // setName(nameIfChooseOther);
                    setColor(hobby.id);
                } else {
                    setColor(hobby.id);
                    setName(hobby.name);
                }
            },
            initIndex: listHobbies.findIndex(item => item.id === color),
            onCancel: () => {
                setName(name);
                goBack();
            },
        });
    }, [color, name, theme]);

    /**
     * Render view
     */
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const RenderBubbleGroup = () => {
        const BALLON_AIR_PATH = `M 0 0 L ${x} 0 C ${x - 50} ${y / 2} ${
            x - 50
        } ${y / 2} ${x} ${y} L 0 ${y} C 50 ${y / 2} 50 ${y / 2} 0 0 Z`;

        return (
            <StyleContainer
                containerStyle={styles.imageView}
                contentContainerStyle={styles.imageContainerView}
                extraHeight={50}>
                <View
                    style={[styles.imageBox, {borderColor: theme.borderColor}]}>
                    {image ? (
                        <StyleImage
                            source={{
                                uri: image,
                            }}
                            customStyle={styles.image}
                        />
                    ) : (
                        <Animated.View
                            style={{transform: [{scale: scaleIconImage}]}}>
                            <StyleTouchable
                                style={[
                                    styles.iconToolUpBox,
                                    {
                                        backgroundColor:
                                            theme.backgroundButtonColor,
                                    },
                                ]}
                                onPress={() => actionSheetRef.current?.show()}
                                activeOpacity={0.9}>
                                <Entypo
                                    name="images"
                                    style={[
                                        styles.iconImage,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            </StyleTouchable>
                        </Animated.View>
                    )}
                </View>

                <View
                    style={[styles.cord, {backgroundColor: theme.borderColor}]}
                />

                <View
                    style={styles.textView}
                    onLayout={e => {
                        setX(e.nativeEvent.layout.width);
                        setY(e.nativeEvent.layout.height);
                    }}>
                    <Svg style={styles.svgBox}>
                        <Path
                            d={BALLON_AIR_PATH}
                            stroke={theme.borderColor}
                            strokeWidth={moderateScale(1)}
                        />
                    </Svg>

                    <View style={styles.iconHobbyBox}>
                        {color ? (
                            <IconHobby
                                color={color}
                                onTouchStart={() => null}
                                onTouchEnd={onNavigatePicker}
                                containerStyle={{marginTop: 0}}
                            />
                        ) : (
                            <Animated.View
                                style={[
                                    styles.iconThemeBox,
                                    {
                                        backgroundColor:
                                            theme.backgroundButtonColor,
                                        transform: [{scale: scaleIconColor}],
                                    },
                                ]}>
                                <Ionicons
                                    name="ios-color-palette-outline"
                                    style={[
                                        styles.iconTheme,
                                        {color: theme.highlightColor},
                                    ]}
                                    onPress={onNavigatePicker}
                                />
                            </Animated.View>
                        )}
                    </View>

                    <View style={styles.contentBox}>
                        <StyleInput
                            value={content}
                            onChangeText={text => setContent(text)}
                            isEffectTabBar={false}
                            hasErrorBox={false}
                            hasUnderLine={false}
                            containerStyle={styles.inputContainer}
                            placeholder="Hello"
                            multiline
                            returnKeyType="default"
                        />
                    </View>
                </View>
            </StyleContainer>
        );
    };

    const RenderButtonComeback = () => {
        return (
            <ButtonBack
                containerStyle={styles.buttonBackView}
                onPress={goBack}
            />
        );
    };

    const RenderName = () => {
        const textColor = theme.textHightLight;
        return (
            <View style={styles.nameView}>
                <View style={styles.avatarNameBox}>
                    <StyleText
                        originValue={`@${name}`}
                        customStyle={[styles.textName, {color: textColor}]}
                    />
                </View>
            </View>
        );
    };

    const RenderButtonPost = () => {
        const titleButton = itemGroupFromEdit
            ? 'profile.post.edit'
            : 'profile.post.post';
        return (
            <StyleTouchable
                customStyle={[
                    styles.buttonPostView,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                        borderColor: theme.borderColor,
                    },
                ]}
                onPress={onConfirmPost}>
                <StyleText
                    i18Text={titleButton}
                    customStyle={[
                        styles.textPost,
                        {color: theme.textHightLight},
                    ]}
                />
            </StyleTouchable>
        );
    };

    return (
        <View style={styles.container}>
            {RenderBubbleGroup()}
            {RenderName()}
            {RenderButtonComeback()}
            {RenderButtonPost()}

            <ActionSheet
                ref={actionSheetRef}
                options={optionsImgPicker}
                cancelButtonIndex={2}
                onPress={onChooseAction}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    buttonBackView: {
        top: '10@s',
        left: '10@s',
        padding: '10@ms',
    },
    // image
    imageView: {
        flex: 1,
    },
    imageContainerView: {
        alignItems: 'center',
    },
    imageBox: {
        width: Metrics.width - scale(50),
        height: Metrics.width - scale(50),
        borderRadius: '300@s',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '1@ms',
        marginTop: '60@vs',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cord: {
        width: '2@ms',
        height: '50@vs',
    },
    textView: {
        width: Metrics.width * 0.6 + scale(100),
        minHeight: '100@vs',
        maxHeight: '160@vs',
        flexDirection: 'row',
    },
    svgBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    iconHobbyBox: {
        height: '100%',
        paddingLeft: 50,
        paddingRight: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconThemeBox: {
        width: '45@ms',
        height: '45@ms',
        borderRadius: '30@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTheme: {
        fontSize: '25@ms',
    },
    iconToolUpBox: {
        borderRadius: '15@ms',
        width: '80@ms',
        height: '80@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        fontSize: '30@ms',
    },
    contentBox: {
        flex: 1,
        paddingRight: 50,
        paddingVertical: '10@vs',
        flexDirection: 'row',
    },
    inputContainer: {
        width: '100%',
    },
    // layer
    layerView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    // name and avatar and content
    nameView: {
        position: 'absolute',
        top: '20@ms',
        alignSelf: 'center',
    },
    avatarNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textName: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    // button post
    buttonPostView: {
        position: 'absolute',
        bottom: '20@s',
        right: '20@s',
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        borderRadius: '20@s',
        borderWidth: '1@ms',
    },
    textPost: {
        fontWeight: 'bold',
    },
    // tool view
    toolView: {
        position: 'absolute',
        width: '100@s',
        paddingVertical: '10@vs',
        bottom: '230@s',
        right: 0,
        alignItems: 'center',
    },
    avatar: {
        width: '50@ms',
        height: '50@ms',
        borderRadius: '30@ms',
    },
    iconLike: {
        fontSize: '60@ms',
        marginTop: '30@vs',
    },
    elementPicker: {
        width: '70%',
        height: '70@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconPicker: {
        width: '40@vs',
        height: '40@vs',
        marginRight: '20@s',
    },
    textPicker: {
        fontWeight: 'bold',
    },
    inputContainerPicker: {
        flex: 1,
    },
    inputOther: {
        width: '100%',
        paddingHorizontal: 0,
    },
    // extension tool
    reportView: {
        position: 'absolute',
        width: '50@ms',
        top: Metrics.safeTopPadding + verticalScale(10),
        right: '10@s',
        alignItems: 'center',
        borderRadius: '30@ms',
    },
    iconMoon: {
        fontSize: '35@ms',
    },
});

export default CreateGroup;

// return (
//     <Svg height="100%" width="100%">
//         <Defs>
//             <Pattern id="idImage">
//                 <Image
//                     id="idImage"
//                     href={{
//                         uri: 'https://previews.123rf.com/images/ylivdesign/ylivdesign1610/ylivdesign161005328/64353641-hot-icona-ballon-d-aria-semplice-illustrazione-di-hot-air-ballon-icone-vettoriali-per-il-web.jpg',
//                     }}
//                     width={300}
//                     height={500}
//                 />
//             </Pattern>
//         </Defs>

// <Path
//     d={BALLON_AIR_PATH}
//     fill="url(#idImage)"
//     stroke="red"
//     strokeWidth={3}
// />
//     </Svg>
// );

// const x = Metrics.width;
// const y = Metrics.height;
// const BALLON_AIR_PATH = `M ${x / 2} 100 C ${x / 2 + 300} 200 ${
//     x / 2 + 200
// } 400 ${x / 2 + 30}  500  L ${x / 2 - 30} 500 C ${x / 2 - 200} 400 ${
//     x / 2 - 300
// } 200 ${x / 2}  100`;
