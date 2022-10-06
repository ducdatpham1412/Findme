import {apiGetTopGroupBuying} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const itemWidth = Metrics.width * 0.7;

const ListTopGroupBuying = () => {
    const theme = Redux.getTheme();

    const [list, setList] = useState<Array<TypeGroupBuying>>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiGetTopGroupBuying();
                setList(res.data);
            } catch (err) {
                appAlert(err);
            }
        };
        getData();
    }, []);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleText
                originValue="Top Group Buying"
                customStyle={[styles.title, {color: theme.borderColor}]}
            />
            <StyleList
                data={list}
                renderItem={({item}) => (
                    <ItemGroupBuying
                        item={item}
                        setList={setList}
                        containerStyle={styles.itemView}
                        detailGroupTarget={DISCOVERY_ROUTE.detailGroupBuying}
                        syncWidth={itemWidth}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                refreshing={false}
                directionalLockEnabled
            />
            <StyleText
                originValue="Discovery"
                customStyle={[styles.title, {color: theme.borderColor}]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
    },
    title: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        left: '10@s',
        marginTop: '5@vs',
        marginBottom: '5@vs',
    },
    itemView: {
        marginHorizontal: '5@s',
        marginTop: 0,
        marginLeft: '2@vs',
    },
});

export default ListTopGroupBuying;
