import axios, {AxiosRequestConfig} from 'axios';
import {useRequest, useUnmount} from 'ahooks';
import {useState, useEffect} from 'react';
import {SIZE_LOADING_LIMIT} from 'asset/standardValue';

const {CancelToken} = axios;

const usePaging = (
    requestPaging: (config: AxiosRequestConfig) => Promise<any>,
    initParams?: any,
    onSuccess?: (data?: any, cbParams?: any) => void,
    onError?: (error?: Error, cbParams?: any) => void,
) => {
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [pageIndex, setPageIndex] = useState(1);
    const [params, setParams] = useState<any>(initParams);
    const [list, setList] = useState<Array<any>>([]);

    const [error, setError] = useState<Error | null>();
    const [noMore, setNoMore] = useState(false);

    const source = CancelToken.source();

    /**
     * FUNCTIONS HELPING
     */
    const handleOnSuccess = (data: any, cbParams: any) => {
        const resData = data || {};
        const newList: Array<any> = resData?.data || [];

        if (refreshing) {
            setList(newList);
        } else if (newList.length > 0) {
            setList([...list, ...newList]);
        }
        setNoMore(pageIndex >= resData?.totalPages);
        setRefreshing(false);
        setLoadingMore(false);

        onSuccess?.(data, cbParams);
    };

    const handleOnError = (err: Error, cbParams: any) => {
        setError(err);
        setRefreshing(false);
        setLoadingMore(false);
        onError?.(err, cbParams);
    };

    const umiRequest = useRequest(requestPaging, {
        loadMore: false,
        manual: true,
        onSuccess: handleOnSuccess,
        onError: handleOnError,
        defaultLoading: true,
    });

    const runRequest = (
        requestPageIndex: number,
        pageSize?: number,
        otherParams?: any,
    ) => {
        umiRequest.run({
            params: {
                pageIndex: requestPageIndex,
                take: pageSize || SIZE_LOADING_LIMIT,
                ...otherParams,
            },
            cancelToken: source.token,
        });
    };

    /**
     * ACTIONS OF LIST
     */
    const onRefresh = () => {
        setRefreshing(true);
    };

    const onLoadMore = () => {
        if (!noMore) {
            setLoadingMore(true);
            setPageIndex(pageIndex + 1);
        }
    };

    /**
     * USE OF HOOK
     */
    useEffect(() => {
        if (refreshing) {
            setPageIndex(1);
            runRequest(1, SIZE_LOADING_LIMIT, params);
        }
    }, [refreshing]);

    useEffect(() => {
        if (pageIndex > 1) {
            setLoadingMore(true);
        }
        runRequest(pageIndex, SIZE_LOADING_LIMIT, params);
    }, [pageIndex]);

    useEffect(() => {
        if (!umiRequest.loading) {
            onRefresh();
        }
    }, [params]);

    useUnmount(() => {
        source.cancel('useEffect cleanup...');
    });

    return {
        ...umiRequest,
        list,
        noMore,
        refreshing,
        loadingMore,
        error,
        onRefresh,
        onLoadMore,
        setParams,
        setList,
    };
};

export default usePaging;
