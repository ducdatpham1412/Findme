import CameraRoll from '@react-native-community/cameraroll';
import {apiUploadImage} from 'api/module';
import ImagePicker from 'react-native-image-crop-picker';
import I18Next from 'utility/I18Next';
import {checkPhoto} from './permission/permission';

const MAX_WIDTH = 1500;
const MAX_HEIGHT = 1500;

export interface ImagePickerParamsType {
    crop?: boolean;
    freeStyleCrop?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    maxWidth?: number;
    maxHeight?: number;
}

interface ImageReadLibraryType {
    first: number;
    after: string | undefined;
}

const ImageUploader = {
    chooseImageFromCamera: (params?: ImagePickerParamsType) =>
        ImagePicker.openCamera({
            mediaType: 'photo',
            width: params?.maxWidth || MAX_WIDTH,
            height: params?.maxHeight || MAX_HEIGHT,
            waitAnimationEnd: true,
            cropping: params?.crop === undefined ? true : params?.crop,
            freeStyleCropEnabled: params?.freeStyleCrop || false,
            multiple: params?.multiple || false,
            cropperChooseText: I18Next.t('common.imageUpload.selected'),
            cropperCancelText: I18Next.t('common.imageUpload.cancel'),
            compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
            compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
            compressImageQuality: 1,
        }),
    // crop = true, multiple = false, maxFiles = 1
    chooseImageFromLibrary: (params?: ImagePickerParamsType) =>
        ImagePicker.openPicker({
            mediaType: 'photo',
            width: params?.maxWidth || MAX_WIDTH,
            height: params?.maxHeight || MAX_HEIGHT,
            waitAnimationEnd: true,
            cropping: params?.crop === undefined ? true : params?.crop,
            freeStyleCropEnabled: params?.freeStyleCrop || false,
            maxFiles: params?.maxFiles || 1,
            multiple: params?.multiple || false,
            cropperChooseText: I18Next.t('common.imageUpload.selected'),
            cropperCancelText: I18Next.t('common.imageUpload.cancel'),
            compressImageMaxWidth: params?.maxWidth || MAX_WIDTH,
            compressImageMaxHeight: params?.maxHeight || MAX_HEIGHT,
            compressImageQuality: 1,
        }),

    readImageFromLibrary: async (params: ImageReadLibraryType) => {
        await checkPhoto();

        const res = await CameraRoll.getPhotos({
            first: params.first,
            after: params?.after,
            assetType: 'Photos',
            include: ['filename'],
        });
        return res;
    },

    // for upload only 1 image, return one link image
    upLoad: async (
        localPath: string,
        quality: number | undefined = undefined,
    ) => {
        const payload = new FormData();

        const formatImage = {
            uri: localPath,
            type: 'image/jpeg',
            name: 'image.jpg',
            filename: 'fileName.jpg',
        };

        payload.append('image', formatImage);
        // send to api upload to get uri image
        const uriImg = await apiUploadImage(payload, quality);
        if (uriImg?.data?.length > 0) {
            return uriImg?.data[0];
        }
        return null;
    },

    // for upload many image, return array of link image
    upLoadManyImg: async (
        arrLocalPath: Array<string>,
        quality: number | undefined = undefined,
    ): Promise<Array<string>> => {
        const payload = new FormData();

        arrLocalPath.forEach((path: any) => {
            const formatImage: any = {
                uri: path,
                type: 'image/jpeg',
                name: 'image.jpg',
                filename: 'fileName.jpg',
            };
            payload.append('image', formatImage);
        });
        // send to api upload to get uri image
        const uriImg = await apiUploadImage(payload, quality);
        if (uriImg?.data.length > 0) {
            return uriImg?.data;
        }
        return [];
    },
};

export default ImageUploader;
