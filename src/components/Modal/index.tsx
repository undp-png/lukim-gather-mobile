import React from 'react';
import {Platform, StatusBar, useWindowDimensions} from 'react-native';
import Modal from 'react-native-modal';

interface Props {
    statusBarTranslucent?: boolean;
    children: JSX.Element;
    isVisible: boolean;
    onBackdropPress?(): void;
    style?: object;
}

const _Modal = ({
    statusBarTranslucent = true,
    isVisible,
    onBackdropPress,
    style,
    children,
    ...modalProps
}: Props) => {
    const {height, width} = useWindowDimensions();
    const statusBarHeight =
        Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    return (
        <Modal
            statusBarTranslucent={statusBarTranslucent}
            deviceHeight={height + statusBarHeight}
            deviceWidth={width}
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            style={style}
            {...modalProps}>
            {children}
        </Modal>
    );
};

export default _Modal;
