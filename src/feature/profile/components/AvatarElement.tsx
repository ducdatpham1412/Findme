import {StyleImage} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {ImageStyle, StyleProp, View, ViewStyle} from 'react-native';

interface AvatarElementProps {
    avatar: string;
    customStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const AvatarElement = (props: AvatarElementProps) => {
    const {avatar, customStyle, imageStyle} = props;
    const theme = useRedux().getTheme();

    return (
        <View
            style={[
                {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor,
                },
                customStyle,
            ]}>
            <StyleImage source={{uri: avatar}} customStyle={imageStyle} />
        </View>
    );
};

export default AvatarElement;
