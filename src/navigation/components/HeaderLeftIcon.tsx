import Redux from 'hook/useRedux';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';

const HeaderLeftIcon = (props: any) => {
    const theme = Redux.getTheme();

    return (
        <TouchableOpacity {...props}>
            <Entypo
                name="chevron-small-left"
                style={[styles.icon, {color: theme.textColor}]}
            />
        </TouchableOpacity>
    );
};

const styles = ScaledSheet.create({
    icon: {
        fontSize: '35@ms',
    },
});

export default HeaderLeftIcon;
