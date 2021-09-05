import {StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {ImageStyle, StyleProp, View, ViewStyle} from 'react-native';

interface AvatarElementProps {
    avatar: string;
    customStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const AvatarElement = (props: AvatarElementProps) => {
    const {avatar, customStyle, imageStyle} = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                customStyle,
            ]}>
            <StyleImage
                source={{uri: avatar}}
                customStyle={imageStyle}
                resizeMode="cover"
            />
        </View>
    );
};

export default AvatarElement;
