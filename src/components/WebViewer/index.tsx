import React, {useRef, useCallback} from 'react';
import {Linking} from 'react-native';
import WebView from 'react-native-webview';

const WebViewer = ({
    html,
    style,
    containerStyle,
}: {
    html: string;
    style?: object;
    containerStyle?: object;
}) => {
    const webview = useRef<any>(null);
    const _html = `<html><meta name="viewport" content="width=device-width, initial-scale=1">
                     <body>${html}</body>
                  </html>`;

    const onNavigationStateChange = useCallback(event => {
        if (event.url.startsWith('http')) {
            webview.current.stopLoading();
            Linking.openURL(event.url);
        }
    }, []);

    return (
        <WebView
            ref={webview}
            style={style}
            containerStyle={containerStyle}
            scalesPageToFit={false}
            originWhitelist={['*']}
            showsVerticalScrollIndicator={false}
            source={{html: _html}}
            onNavigationStateChange={onNavigationStateChange}
        />
    );
};

export default WebViewer;
