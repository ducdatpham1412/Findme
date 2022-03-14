import {TypeBubblePalace} from 'api/interface';
import {
    apiGetListBubbleActive,
    apiGetListBubbleActiveOfUserEnjoy,
} from 'api/module';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {interactBubble, onGoToSignUp} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import Bubble from './components/Bubble';

const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const DiscoveryScreen = () => {
    useNotification();

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const selectedApi = useMemo(() => {
        return isModeExp
            ? apiGetListBubbleActiveOfUserEnjoy
            : apiGetListBubbleActive;
    }, [isModeExp]);
    const {list, setList, onLoadMore, refreshing, onRefresh} = usePaging({
        request: selectedApi,
        params: {
            take: 30,
        },
        numberMaxForList: 30,
    });

    /**
     * Render view
     */
    const onInteractBubble = useCallback(
        (itemBubble: TypeBubblePalace) => {
            if (!isModeExp) {
                interactBubble({
                    itemBubble,
                    isBubble: true,
                });
            } else {
                appAlert('discovery.bubble.goToSignUp', {
                    moreNotice: 'common.letGo',
                    moreAction: onGoToSignUp,
                });
            }
        },
        [isModeExp],
    );

    const RenderItemBubble = useCallback((item: TypeBubblePalace) => {
        return <Bubble item={item} onInteractBubble={onInteractBubble} />;
    }, []);

    const RenderBubblePlaceStatic = useMemo(() => {
        return (
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                snapToInterval={bubbleHeight}
                scrollEventThrottle={16}
                decelerationRate="fast"
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                // onEndReached={undefined}
                // onScroll={e => {
                //     const indexToLast = Math.round(
                //         (e.nativeEvent.contentSize.height -
                //             e.nativeEvent.contentOffset.y) /
                //             bubbleHeight,
                //     );
                //     if (indexToLast === 2 && !loading) {
                //         onLoadMore();
                //     }
                // }}
            />
        );
    }, [list, refreshing]);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {RenderBubblePlaceStatic}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    // discovery palace
    discoveryPalace: {
        width: '100%',
        height: 2 * Metrics.height,
    },
    discoveryPalaceStatic: {
        flex: 1,
        paddingBottom: '50@s',
    },
});

export default DiscoveryScreen;
