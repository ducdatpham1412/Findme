import {StyleImage} from 'components/base';
import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface PostStatusProps {
    data: Array<any>;
}

interface ListPhotoType {
    id: number;
    image: string;
    caption: string;
}

const PostStatus = (props: PostStatusProps) => {
    const {data} = props;

    return (
        <View style={{width: '100%'}}>
            {data.map((item: ListPhotoType) => (
                <View key={item.id} style={styles.postView}>
                    <StyleImage
                        source={{uri: item.image}}
                        customStyle={styles.image}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = ScaledSheet.create({
    postView: {
        width: '100%',
        backgroundColor: 'lightblue',
        marginVertical: 50,
    },
    image: {
        width: '100%',
        minHeight: '300@vs',
        maxHeight: '500@vs',
    },
});

export default PostStatus;
