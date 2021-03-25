import {StyleContainer} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import ActivityProfile from './components/ActivityProfile';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';

/**
 * MAIN PROFILE CONTAINS 3 MODULES:
 * 1. 2 BUTTONS SEARCH AND SWITCH TO SETTING SCREEN
 * 2. INFORMATION PROFILE: CONTAIN AVATAR, NAME, FOLLOW AND INTRODUCE
 * 3. POST STATUS: IN THE FUTURE WILL CONTAIN SAVE STATUS AND TIMELINE
 */

const ProfileScreen: React.FunctionComponent = () => {
    // get from Redux, when click Change will get API and set to Redux in others
    const profile = useRedux().getProfile();

    return (
        <>
            {/* SEARCH AND SETTING BUTTON PART */}
            <SearchAndSetting />

            <StyleContainer scrollEnabled customStyle={styles.body}>
                {/* INFORMATION PROFILE */}
                <InformationProfile profile={profile.info} />

                {/* ACTIVITY LOG */}
                <ActivityProfile listPhotos={profile.info?.listPhotos || []} />
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    body: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: '100@vs',
    },
});

export default ProfileScreen;
