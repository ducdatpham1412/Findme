import {StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import PostStatus from '../post/PostStatus';

const winWidth = Dimensions.get('screen').width;

const ButtonActivity = () => {
    const theme = useRedux().getTheme();

    const addPhoto = async () => {
        console.log('Adding photo');
    };

    return (
        <View style={styles.buttonActivityBox}>
            <StyleTouchable
                customStyle={[
                    styles.buttonActivity,
                    {backgroundColor: theme.backgroundButtonColor},
                ]}
                onPress={addPhoto}>
                <Feather
                    name="plus"
                    style={[
                        styles.iconButtonActivity,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>
        </View>
    );
};

/**
 * BOSS HERE, IN THE FUTURE WANT TO MAKE THREE TAB: TIMELINE, POST AND SAVE
 */
interface ActivityProfileProps {
    listPhotos: Array<any>;
}

const ActivityProfile = (props: ActivityProfileProps) => {
    const {listPhotos} = props;

    return (
        <View style={styles.container}>
            <ButtonActivity />

            <PostStatus data={listPhotos} />

            {/* <ActivityTab.Navigator>
                <ActivityTab.Screen name='postStatus' component={PostStatus} />
            </ActivityTab.Navigator> */}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingTop: winWidth / 6,
    },

    // BUTTON ACTIVITY
    buttonActivityBox: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActivity: {
        width: winWidth / 6,
        height: winWidth / 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    iconButtonActivity: {
        fontSize: 40,
    },
});

export default ActivityProfile;
