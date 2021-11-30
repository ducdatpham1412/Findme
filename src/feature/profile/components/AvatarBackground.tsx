import {StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import {View} from 'react-native';

interface Props {
    avatar: string;
}

const AvatarBackground = ({avatar}: Props) => {
    const theme = Redux.getTheme();

    return (
        <View
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: theme.backgroundColor,
            }}>
            <StyleImage
                source={{uri: avatar}}
                customStyle={{width: '100%', height: '100%'}}
            />
        </View>
    );
};

export default memo(AvatarBackground);
