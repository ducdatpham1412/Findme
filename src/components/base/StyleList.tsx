import Redux from 'hook/useRedux';
import React, {forwardRef, useRef} from 'react';
import {FlatList, FlatListProps, RefreshControl, View} from 'react-native';
import StyleText from './StyleText';

interface StyleListProps extends FlatListProps<any> {
    data: any;
    ListHeaderComponent?: any;
    loading?: boolean;
    loadingMore?: boolean;
    disableRefresh?: boolean;
    refreshing?: boolean;
    onRefresh?(): void;
    onLoadMore?(): void;
}

const StyleList = (props: StyleListProps, ref: any) => {
    const {data, refreshing, onRefresh, onLoadMore, loadingMore} = props;
    const theme = Redux.getTheme();

    const listRef = useRef<FlatList>(null);

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        }
    };
    const handleLoadMore = () => {
        if (onLoadMore) {
            onLoadMore();
        }
    };

    // render_view
    const renderFooterView = () => {
        if (data && data.length > 0 && loadingMore) {
            return (
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        marginVertical: '7@vs',
                    }}
                />
            );
        }
        return null;
    };
    const renderEmptyView = () => {
        return (
            <StyleText
                originValue="----"
                customStyle={{
                    fontSize: 17,
                    color: theme.textColor,
                    alignSelf: 'center',
                    marginTop: 40,
                }}
            />
        );
    };

    return (
        <FlatList
            ref={ref || listRef}
            initialNumToRender={10}
            onEndReachedThreshold={0.01}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={!!refreshing}
                    onRefresh={handleRefresh}
                    tintColor={theme.highlightColor}
                    colors={[theme.highlightColor]}
                />
            }
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooterView}
            ListEmptyComponent={renderEmptyView}
            {...props}
        />
    );
};

export default forwardRef(StyleList);
