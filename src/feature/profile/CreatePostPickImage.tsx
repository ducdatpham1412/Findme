import {useIsFocused} from '@react-navigation/native';
import {Metrics} from 'asset/metrics';
import {MAX_NUMBER_IMAGES_POST} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import StyleTabView from 'components/StyleTabView';
import ModalPickImage from 'feature/mess/components/ModalPickImage';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import {chooseImageFromCamera, logger} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    route: {
        params: {
            userReviewed?: {
                id: number;
                name: string;
                avatar: string;
            };
        };
    };
}

const {width} = Metrics;

const CreatePostPickImage = ({route}: Props) => {
    const theme = Redux.getTheme();
    const tabPickRef = useRef<StyleTabView>(null);
    const isFocused = useIsFocused();

    const [images, setImages] = useState<Array<string>>([]);
    const [indexScroll, setIndexScroll] = useState(0);
    const [video, setVideo] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

    const onChooseImage = (url: string) => {
        if (images.length === MAX_NUMBER_IMAGES_POST) {
            return;
        }
        if (images.includes(url)) {
            if (images.length === 1) {
                return;
            }
            setImages(images.filter(item => item !== url));
        } else {
            const oldLength = images.length;
            setImages(images.concat(url));
            setIndexScroll(oldLength);
        }
    };

    const onChooseFromCamera = async () => {
        if (tabIndex === 1) {
            tabPickRef.current?.navigateToIndex(0);
        }
        await chooseImageFromCamera((path: string) =>
            setImages(images.concat(path)),
        );
    };

    const onChooseVideo = async () => {
        if (tabIndex === 0) {
            if (!video) {
                try {
                    const res = await ImageUploader.chooseVideoFromLibrary();
                    tabPickRef.current?.navigateToIndex(1);
                    setVideo(res.path);
                } catch (err) {
                    logger(err);
                }
            } else {
                tabPickRef.current?.navigateToIndex(1);
            }
        } else {
            try {
                const res = await ImageUploader.chooseVideoFromLibrary();
                setVideo(res.path);
            } catch (err) {
                logger(err);
            }
        }
    };

    const onNavigatePreview = () => {
        navigate(PROFILE_ROUTE.createPostPreview, {
            itemNew: {
                images: tabIndex === 0 ? images : [video],
                isVideo: tabIndex === 1,
                userReviewed: route.params?.userReviewed,
            },
        });
    };

    /**
     * Render views
     */
    const Header = () => {
        return (
            <View
                style={[
                    styles.headerView,
                    {borderBottomColor: theme.borderColor},
                ]}>
                <StyleTouchable
                    customStyle={styles.iconCloseView}
                    onPress={goBack}>
                    <AntDesign
                        name="close"
                        style={[styles.iconClose, {color: theme.textColor}]}
                    />
                </StyleTouchable>
                <StyleText
                    i18Text="profile.post.pickImage"
                    customStyle={[styles.textHeader, {color: theme.textColor}]}
                />
                <StyleTouchable
                    customStyle={styles.nextView}
                    onPress={onNavigatePreview}>
                    <StyleText
                        i18Text="common.next"
                        customStyle={[
                            styles.textNext,
                            {color: theme.highlightColor},
                        ]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    const ImagePreview = () => {
        if (tabIndex === 1) {
            if (!video) {
                return null;
            }
            return (
                <Video
                    key={video}
                    source={{
                        uri: video,
                    }}
                    style={{
                        width,
                        minHeight: '60%',
                        maxHeight: '80%',
                    }}
                    repeat
                    controls
                    muted={!isFocused}
                    paused={!isFocused}
                />
            );
        }
        return (
            <ScrollSyncSizeImage
                images={images}
                syncWidth={Metrics.width}
                containerStyle={styles.imagePreviewView}
                index={indexScroll}
                onChangeIndex={value => setIndexScroll(value)}
            />
        );
    };

    const Tool = () => {
        return (
            <View
                style={[
                    styles.toolView,
                    {
                        borderColor: theme.holderColor,
                    },
                ]}>
                <StyleTouchable
                    customStyle={styles.touchImage}
                    onPress={() => tabPickRef.current?.navigateToIndex(0)}
                    hitSlop={15}>
                    <FontAwesome
                        name="image"
                        style={[
                            styles.iconImage,
                            {
                                color: theme.textColor,
                            },
                        ]}
                    />
                </StyleTouchable>
                <StyleTouchable
                    customStyle={styles.touchCamera}
                    onPress={onChooseFromCamera}
                    hitSlop={15}>
                    <Ionicons
                        name="camera-outline"
                        style={[
                            styles.iconCamera,
                            {
                                color: theme.textColor,
                            },
                        ]}
                    />
                </StyleTouchable>

                {tabIndex === 0 && (
                    <StyleText
                        originValue={`${indexScroll + 1} / ${images.length}`}
                        customStyle={[
                            styles.indexText,
                            {color: theme.textColor},
                        ]}
                    />
                )}

                <StyleTouchable
                    customStyle={[
                        styles.videoTouch,
                        {borderColor: theme.textColor},
                    ]}
                    hitSlop={10}
                    onPress={onChooseVideo}>
                    <View
                        style={[
                            styles.spaceBackground,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                    />
                    <Ionicons
                        name="ios-videocam-outline"
                        style={[
                            styles.iconVideo,
                            {
                                color: theme.textHightLight,
                            },
                        ]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {Header()}
            {ImagePreview()}
            {Tool()}
            <StyleTabView
                ref={tabPickRef}
                containerStyle={styles.tabView}
                onChangeTabIndex={index => {
                    setTabIndex(index);
                }}>
                <ModalPickImage
                    images={images}
                    onChooseImage={onChooseImage}
                    numberColumns={4}
                    containerStyle={styles.modalPickImageView}
                    initIndexImage={0}
                />
                <View />
            </StyleTabView>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    // header
    headerView: {
        width: '100%',
        paddingVertical: '10@vs',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    iconCloseView: {
        position: 'absolute',
        left: '20@s',
    },
    iconClose: {
        fontSize: '25@ms',
    },
    textHeader: {
        fontSize: '15@ms',
    },
    nextView: {
        position: 'absolute',
        right: '20@s',
    },
    textNext: {
        fontSize: '16@ms',
        fontWeight: 'bold',
    },
    // image preview
    imagePreviewView: {
        maxHeight: '60%',
    },
    // tool
    toolView: {
        width: '100%',
        height: '35@ms',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    touchImage: {
        position: 'absolute',
        left: '20@s',
    },
    iconImage: {
        fontSize: '13@ms',
    },
    touchCamera: {
        position: 'absolute',
        left: '60@s',
    },
    iconCamera: {
        fontSize: '16.5@ms',
    },
    videoTouch: {
        position: 'absolute',
        right: '10@s',
        width: '25@ms',
        height: '25@ms',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderRadius: 20,
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        opacity: 0.9,
    },
    iconVideo: {
        fontSize: '14@ms',
    },
    indexText: {
        fontSize: '10@ms',
    },
    // modal pick image view
    tabView: {
        flex: 1,
    },
    modalPickImageView: {
        height: undefined,
        flex: 1,
    },
});

export default CreatePostPickImage;
