import dynamicLink from '@react-native-firebase/dynamic-links';
import {useEffect} from 'react';

const DynamicLink = () => {
    useEffect(() => {
        const subscribe = dynamicLink().onLink(() => null);
        dynamicLink()
            .getInitialLink()
            .then((link: any) => {
                console.log('link is: ', link);
            });
        return () => subscribe();
    }, []);

    return null;
};

export default DynamicLink;
