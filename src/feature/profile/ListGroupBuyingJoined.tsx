import {TypeGroupBuying} from 'api/interface';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    listPaging: any;
    isInProfileTab: boolean;
}

const ListGroupBuyingJoined = (props: Props) => {
    const {listPaging, isInProfileTab} = props;

    const detailGroupTarget = isInProfileTab
        ? PROFILE_ROUTE.detailGroupBuying
        : ROOT_SCREEN.detailGroupBuying;

    return (
        <View style={styles.container}>
            {listPaging.list.map((item: TypeGroupBuying) => {
                return (
                    <ItemGroupBuying
                        key={item.id}
                        item={item}
                        setList={listPaging.setList}
                        detailGroupTarget={detailGroupTarget}
                    />
                );
            })}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
});

export default ListGroupBuyingJoined;
