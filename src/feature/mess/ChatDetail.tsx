import {StyleContainer} from 'components/base';
import Header from 'navigation/components/Header';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import UserInput from './components/UserInput';

// RouteParams {
//     id: number,
//     name: string,
//     avatar: string,
// }

const ChatDetail = ({route}: any) => {
    const {id, name, avatar} = route.params;
    const [mess, setMess] = useState('');

    return (
        <View style={styles.container}>
            <Header headerTitle={name} />

            <StyleContainer
                containerStyle={styles.contentPart}
                extraHeight={180}>
                <UserInput mess={mess} setMess={setMess} />
            </StyleContainer>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contentPart: {
        flex: 1,
    },
});

export default ChatDetail;
