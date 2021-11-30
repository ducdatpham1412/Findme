import {StyleImage, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {showSwipeImages} from 'navigation/NavigationService';
import React from 'react';
import {ImageStyle, StyleProp, ViewStyle} from 'react-native';

interface AvatarElementProps {
    avatar: string;
    customStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const AvatarElement = (props: AvatarElementProps) => {
    const {avatar, customStyle, imageStyle} = props;
    const theme = Redux.getTheme();

    const onSeeDetailAvatar = () => {
        showSwipeImages({
            listImages: [{url: avatar}],
        });
    };

    return (
        <StyleTouchable
            customStyle={[
                {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                customStyle,
            ]}
            onPress={onSeeDetailAvatar}>
            <StyleImage source={{uri: avatar}} customStyle={imageStyle} />
        </StyleTouchable>
    );
};

export default AvatarElement;
