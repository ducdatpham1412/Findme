import {StyleImage} from 'components/base';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface PostStatusProps {
    itemPost: any;
}

const PostStatus = (props: PostStatusProps) => {
    const {itemPost} = props;

    return <View style={styles.container} />;
};

const styles = ScaledSheet.create({
    container: {
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
