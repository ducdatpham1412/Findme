import StyleWebView from 'components/base/StyleWebView';
import StyleHeader from 'navigation/components/StyleHeader';
import React from 'react';

interface Props {
    route: {
        params: {
            title: string;
            linkWeb: string;
        };
    };
}

const WebViewScreen = ({route}: Props) => {
    const {title, linkWeb} = route.params;

    return (
        <>
            <StyleHeader title={title || ''} />
            <StyleWebView source={{uri: linkWeb}} />
        </>
    );
};

export default WebViewScreen;
