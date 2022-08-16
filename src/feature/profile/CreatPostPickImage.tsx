import {Metrics} from 'asset/metrics';
import {MAX_NUMBER_IMAGES_POST} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import ModalPickImage from 'feature/mess/components/ModalPickImage';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {chooseImageFromCamera} from 'utility/assistant';

const CreatPostPickImage = () => {
    const theme = Redux.getTheme();
    const scrollRef = useRef<ScrollView>(null);
    const [images, setImages] = useState<Array<string>>([]);
    const [indexScroll, setIndexScroll] = useState(1);

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
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    x: Metrics.width * oldLength,
                    animated: true,
                });
            }, 100);
        }
    };

    const onChooseFromCamera = async () => {
        await chooseImageFromCamera((path: string) =>
            setImages(images.concat(path)),
        );
    };

    const onNavigatePreview = () => {
        navigate(PROFILE_ROUTE.createPostPreview, {
            itemNew: {
                images,
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

    const ImagePreview = useMemo(() => {
        return (
            <View
                style={[
                    styles.imagePreviewView,
                    {maxHeight: Metrics.width * 1.2},
                ]}>
                <ScrollSyncSizeImage
                    ref={scrollRef}
                    images={images}
                    syncWidth={Metrics.width}
                    scrollViewProps={{
                        onScroll: e => {
                            const index = Math.floor(
                                e.nativeEvent.contentOffset.x / Metrics.width,
                            );
                            setIndexScroll(index + 1);
                        },
                    }}
                />
            </View>
        );
    }, [images]);

    const Tool = () => {
        return (
            <View style={[styles.toolView, {borderColor: theme.holderColor}]}>
                <StyleText
                    originValue={`${indexScroll} / ${images.length}`}
                    customStyle={[styles.indexText, {color: theme.textColor}]}
                />
                <StyleTouchable
                    customStyle={[
                        styles.iconCameraTouch,
                        {borderColor: theme.textColor},
                    ]}
                    hitSlop={10}
                    onPress={onChooseFromCamera}>
                    <View
                        style={[
                            styles.spaceBackground,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                    />
                    <Ionicons
                        name="camera-outline"
                        style={[
                            styles.iconCamera,
                            {color: theme.textHightLight},
                        ]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    const ModalImage = () => {
        return (
            <ModalPickImage
                images={images}
                onChooseImage={onChooseImage}
                numberColumns={4}
                containerStyle={styles.modalPickImageView}
                initIndexImage={0}
            />
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {Header()}
            {ImagePreview}
            {Tool()}
            {ModalImage()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
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
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
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
    iconCameraTouch: {
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
    iconCamera: {
        fontSize: '14@ms',
    },
    indexText: {
        fontSize: '10@ms',
    },
    // modal pick image view
    modalPickImageView: {
        height: undefined,
        flex: 1,
    },
});

export default CreatPostPickImage;
