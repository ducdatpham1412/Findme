/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect, useRef, useState} from 'react';
import * as RNIap from 'react-native-iap';
import {logger} from './assistant';

const listDonations = [
    {
        id: 0,
        productId: 'doceo.donation.consumable.0',
        value: 0,
    },
];

const appPurchase = () => {
    const purchaseUpdateSubscription = useRef<any>(null);
    const purchaseErrorSubscription = useRef<any>(null);
    const [isLoading] = useState(false);

    const listenerSuccess = () => {
        purchaseUpdateSubscription.current = RNIap.purchaseUpdatedListener(
            async purchase => {
                const data = purchase.transactionReceipt;
                logger('data purchase: ', data);
            },
        );
    };

    const listenerError = () => {
        purchaseErrorSubscription.current = RNIap.purchaseErrorListener(
            (error: RNIap.PurchaseError) => {
                logger('purchaseErrorListener', error);
            },
        );
    };

    const startConnection = async () => {
        try {
            await RNIap.initConnection();
            const res = await RNIap.getProducts({
                skus: ['doffy.purchase.test.01'],
            });
            logger('list product: ', res);
            listenerSuccess();
            listenerError();
        } catch (err) {
            logger('startConnection', false, err);
        }
    };

    const endConnections = async () => {
        try {
            await RNIap.endConnection();
        } catch (err) {
            logger('endConnections', false, err);
        }
    };

    useEffect(() => {
        startConnection();
        return () => {
            if (purchaseUpdateSubscription.current) {
                purchaseUpdateSubscription.current.remove();
                purchaseUpdateSubscription.current = null;
            }
            if (purchaseErrorSubscription.current) {
                purchaseErrorSubscription.current.remove();
                purchaseErrorSubscription.current = null;
            }
            endConnections();
        };
    }, []);

    const requestPurchase = async (idProduct: string) => {
        await RNIap.requestPurchase({
            sku: idProduct,
        });
    };

    return {
        listDonations,
        requestPurchase,
        isLoading,
    };
};

export default appPurchase;
