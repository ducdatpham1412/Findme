import React from 'react';
import {useNotification} from 'utility/notification';
import ListBubbleCouple from './ListBubbleCouple';

const DiscoveryScreen = () => {
    useNotification();

    return <ListBubbleCouple />;
};

export default DiscoveryScreen;
