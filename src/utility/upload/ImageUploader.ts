import {apiUploadImage} from 'api/module';
import ImagePicker from 'react-native-image-crop-picker';
import I18Next from 'utility/I18Next';

// const fs = require('fs');

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;

export interface ImagePickerParamsType {
    crop?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    maxWidth?: number;
    maxHeight?: number;
}

const ImageUploader = {
    chooseImageFromCamera: (params?: ImagePickerParamsType) =>
        ImagePicker.openCamera({
            mediaType: 'photo',
            width: params?.maxWidth || MAX_WIDTH,
            height: params?.maxHeight || MAX_HEIGHT,
            waitAnimationEnd: true,
            cropping: params?.crop || true,
            multiple: params?.multiple || false,
            cropperChooseText: I18Next.t('common.imageUpload.selected'),
            cropperCancelText: I18Next.t('common.imageUpload.cancel'),
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
            compressImageQuality: 0.8,
        }),
    // crop = true, multiple = false, maxFiles = 1
    chooseImageFromLibrary: (params?: ImagePickerParamsType) =>
        ImagePicker.openPicker({
            mediaType: 'photo',
            width: params?.maxWidth || MAX_WIDTH,
            height: params?.maxHeight || MAX_HEIGHT,
            waitAnimationEnd: true,
            cropping: params?.crop || true,
            maxFiles: params?.maxFiles || 1,
            multiple: params?.multiple || false,
            cropperChooseText: I18Next.t('common.imageUpload.selected'),
            cropperCancelText: I18Next.t('common.imageUpload.cancel'),
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
            compressImageQuality: 0.8,
        }),

    // for upload only 1 image, return one link image
    upLoad: async (localPath: any) => {
        const timeStamp = new Date().getTime();
        const payload = new FormData();

        const formatImage = {
            uri: localPath,
            type: 'image/jpeg',
            name: `${timeStamp}.jpg`,
            filename: 'fileName.jpg',
        };

        payload.append('image', formatImage);
        // send to api upload to get uri image
        const uriImg = await apiUploadImage(payload);
        if (uriImg?.data?.length > 1) {
            return uriImg?.data[0];
        }
        return null;
    },

    // for upload many image, return array of link image
    upLoadManyImg: async (arrLocalPath: Array<any>) => {
        const timeStamp = new Date().getTime();
        const formData = new FormData();
        arrLocalPath.forEach((path: any) => {
            const formatImage: any = {
                uri: path,
                name: `${timeStamp}.jpg`,
                type: 'image/jpeg',
            };
            formData.append('image', formatImage);
        });
        // send to api upload to get uri image
        const uriImg = await apiUploadImage(formData);
        if (uriImg?.data.length > 1) {
            return uriImg?.data;
        }
        return null;
    },
};

export default ImageUploader;
