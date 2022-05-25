import {TypeCreateGroupResponse} from 'api/interface';
import {
    apiGetListBubbleGroup,
    apiGetListBubbleGroupOfUserEnjoy,
} from 'api/module';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import LoadingScreen from 'components/LoadingScreen';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {socketJoinCommunity} from 'hook/useSocketIO';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {bubbleHeight} from './components/Bubble';
import BubblePalaceGroup from './components/BubblePalaceGroup';

const ListBubbleGroup = () => {
    const theme = Redux.getTheme();
    const token = Redux.getToken();

    const selectApi = useMemo(() => {
        return token ? apiGetListBubbleGroup : apiGetListBubbleGroupOfUserEnjoy;
    }, [token]);

    const {list, refreshing, onRefresh, onLoadMore} = usePaging({
        request: selectApi,
        params: {
            take: 30,
        },
    });

    /**
     * Function
     */
    const onJoinGroup = (itemGroup: TypeCreateGroupResponse) => {
        socketJoinCommunity({
            profilePostGroupId: itemGroup.id,
        });
    };

    const onGoToConversation = (chatTagId: string) => {
        Redux.setChatTagFromNotification(chatTagId);
    };

    /**
     * Render view
     */
    const RenderItemBubble = useCallback((item: TypeCreateGroupResponse) => {
        return (
            <BubblePalaceGroup
                item={item}
                onJoinGroup={onJoinGroup}
                onGoToConversation={onGoToConversation}
            />
        );
    }, []);

    const RenderBubblePlaceStatic = () => {
        return (
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                snapToInterval={bubbleHeight}
                // scrollEventThrottle={16}
                decelerationRate="fast"
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                ListEmptyComponent={LoadingScreen}
                // onEndReached={undefined}
                // onScroll={e => {
                //     const indexToLast = Math.round(
                //         (e.nativeEvent.contentSize.height -
                //             e.nativeEvent.contentOffset.y) /
                //             bubbleHeight,
                //     );
                //     Redux.setBubbleFocusing(list[indexToLast].id);
                // }}
            />
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {RenderBubblePlaceStatic()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.tabBarUp,
    },
});

export default ListBubbleGroup;
