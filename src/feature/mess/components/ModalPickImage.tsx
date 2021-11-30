import {Metrics} from 'asset/metrics';
import {StyleImage, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ImageUploader from 'utility/ImageUploader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {isIOS} from 'utility/assistant';

interface Props {
    images: Array<string>;
    setImages: any;
    containerStyle?: StyleProp<ViewStyle>;
}
interface StatusLibrary {
    endCursor: string | undefined;
    hasNext: boolean;
}

const ModalPickImage = (props: Props) => {
    const theme = Redux.getTheme();
    const {images, setImages, containerStyle} = props;

    const [libraryImages, setLibraryImages] = useState<Array<any>>([]);

    const [pageIndex, setPageIndex] = useState(1);
    const [statusLibrary, setStatusLibrary] = useState<StatusLibrary>({
        endCursor: undefined,
        hasNext: true,
    });

    const [firstLoad, setFirstLoad] = useState(20);

    const getData = async () => {
        const res = await ImageUploader.readImageFromLibrary({
            first: firstLoad,
            after: statusLibrary.endCursor,
        });

        // check have next page
        const endCursor = res.page_info.end_cursor;
        const haveNextPage = res.page_info.has_next_page;
        setStatusLibrary({
            endCursor,
            hasNext: haveNextPage,
        });

        // set to state libraryImages
        const moreImages = res.edges.map(item => {
            if (isIOS) {
                return item.node.image.uri.concat(
                    `/${item.node.image.filename}`,
                );
            }
            return item.node.image.uri;
        });
        setLibraryImages(libraryImages.concat(moreImages));
        setFirstLoad(80);
    };

    useEffect(() => {
        if (statusLibrary.hasNext) {
            getData();
        }
    }, [pageIndex]);

    const onLoadMoreImage = () => {
        if (statusLibrary.hasNext) {
            setPageIndex(pageIndex + 1);
        }
    };

    // render_view
    const renderImage = useCallback(
        ({item, index}: any) => {
            const isChosen = images.includes(item);

            const onChooseImage = () => {
                if (!isChosen) {
                    if (images.length < 2) {
                        setImages(images.concat(item));
                    } else {
                        const temp = [item].concat(images[0]);
                        setImages(temp);
                    }
                } else {
                    const temp = [...images];
                    const _index = temp.indexOf(item);
                    temp.splice(_index, 1);
                    setImages(temp);
                }
            };

            return (
                <StyleTouchable
                    key={index}
                    onPress={onChooseImage}
                    customStyle={styles.imageBox}>
                    <StyleImage source={{uri: item}} style={styles.image} />

                    {isChosen && (
                        <View
                            style={[
                                styles.layoutChosen,
                                {backgroundColor: theme.backgroundColor},
                            ]}
                        />
                    )}

                    {isChosen && (
                        <AntDesign
                            name="check"
                            style={[
                                styles.checkIcon,
                                {color: theme.highlightColor},
                            ]}
                        />
                    )}
                </StyleTouchable>
            );
        },
        [images],
    );

    return (
        <View style={[styles.container, containerStyle]}>
            <StyleList
                data={libraryImages}
                renderItem={renderImage}
                numColumns={3}
                onLoadMore={onLoadMoreImage}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: Metrics.height / 2,
    },
    imageBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: (Metrics.width - 6) / 3,
        height: (Metrics.width - 6) / 3,
        marginHorizontal: 1,
    },
    layoutChosen: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    checkIcon: {
        position: 'absolute',
        fontSize: '60@ms',
    },
    contentContainer: {
        paddingBottom: '20@vs',
    },
});

export default ModalPickImage;
