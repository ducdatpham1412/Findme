import {TypeChatTagResponse} from 'api/interface';
import {StyleImage} from 'components/base';
import React, {memo} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {moveMeToEndOfListMember} from 'utility/assistant';

interface Props {
    itemChatTag: TypeChatTagResponse;
}

const HeaderRequestPublic = (props: Props) => {
    const {itemChatTag} = props;
    const listMember = moveMeToEndOfListMember(itemChatTag.listUser);

    return (
        <View style={styles.listMemberBox}>
            {listMember.map(item => (
                <StyleImage
                    // key={item.id}
                    source={{uri: item.avatar}}
                    customStyle={styles.avatarMember}
                />
            ))}
        </View>
    );
};

const styles = ScaledSheet.create({
    listMemberBox: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    avatarMember: {
        width: '30@s',
        height: '30@s',
        borderRadius: '20@s',
        marginHorizontal: '10@s',
    },
});

export default memo(HeaderRequestPublic);
