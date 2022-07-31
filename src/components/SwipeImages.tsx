import CameraRoll from '@react-native-community/cameraroll';
import {Metrics} from 'asset/metrics';
import Redux from 'hook/useRedux';
import {appAlert, goBack, TypeSwipeImages} from 'navigation/NavigationService';
import React, {useRef} from 'react';
import {View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import {isIOS} from 'utility/assistant';
import {checkSaveImage} from 'utility/permission/permission';
import {StyleImage, StyleTouchable} from './base';
import StyleActionSheet from './common/StyleActionSheet';

interface Props {
    route: {
        params: TypeSwipeImages;
    };
}

let uriToSave = '';

const SwipeImages = ({route}: Props) => {
    const {
        listImages,
        initIndex = 0,
        allowSaveImage = true,
        textSaveImage = 'common.canNotSave',
    } = route.params;
    const theme = Redux.getTheme();
    const optionsRef = useRef<any>(null);

    const onSaveToLibrary = async () => {
        if (allowSaveImage) {
            try {
                if (isIOS) {
                    await CameraRoll.save(uriToSave, {
                        type: 'photo',
                    });
                } else {
                    await checkSaveImage();
                    const res = await RNFetchBlob.config({
                        fileCache: true,
                        appendExt: 'png',
                    }).fetch('GET', uriToSave);
                    await CameraRoll.save(`file://${res.data}`, {
                        type: 'photo',
                        album: 'Doffy',
                    });
                }
            } catch (err) {
                appAlert(err);
            }
        }
    };

    const onSetAndShowOption = (uri: string) => {
        if (!allowSaveImage) {
            return;
        }
        uriToSave = uri;
        optionsRef.current.show();
    };

    return (
        <>
            <ImageViewer
                imageUrls={listImages}
                index={initIndex}
                useNativeDriver
                enableSwipeDown
                enableImageZoom
                onSwipeDown={goBack}
                renderImage={({source, style}) => {
                    const height = style.width
                        ? (style.height / style.width) * Metrics.width
                        : 0;
                    return (
                        <View
                            style={[
                                styles.elementView,
                                {backgroundColor: theme.backgroundColor},
                            ]}>
                            <StyleTouchable
                                // onPress={() => onSetAndShowOption(source.uri)}
                                onLongPress={() =>
                                    onSetAndShowOption(source.uri)
                                }
                                delayLongPress={100}
                                activeOpacity={1}>
                                <StyleImage
                                    source={{uri: source.uri}}
                                    customStyle={[
                                        styles.image,
                                        {
                                            height,
                                        },
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    );
                }}
            />

            <StyleTouchable
                customStyle={[
                    styles.comebackView,
                    {backgroundColor: theme.backgroundButtonColor},
                ]}
                onPress={goBack}>
                <Feather
                    name="x"
                    style={[styles.iconComeBack, {color: theme.textColor}]}
                />
            </StyleTouchable>

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: allowSaveImage ? 'common.save' : textSaveImage,
                        action: onSaveToLibrary,
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    elementView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    comebackView: {
        position: 'absolute',
        padding: '7@ms',
        right: '20@s',
        top: '10@vs',
        borderRadius: '20@ms',
    },
    iconComeBack: {
        fontSize: '20@ms',
    },
    image: {
        width: Metrics.width,
        borderRadius: '5@s',
    },
});

export default SwipeImages;
