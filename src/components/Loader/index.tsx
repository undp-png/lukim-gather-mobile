import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

import COLORS from 'utils/colors';

import styles from './styles';

interface LoaderProps {
    style?: object;
    loading: boolean;
    color?: string;
    [key: string]: any;
}

export const Loader: React.FC<LoaderProps> = ({
    style,
    loading,
    color = COLORS.secondary,
    ...activityProps
}) => {
    return (
        <ActivityIndicator
            style={style || StyleSheet.absoluteFill}
            animating={loading}
            color={color}
            size="large"
            {...activityProps}
        />
    );
};

export const ModalLoader: React.FC<LoaderProps> = ({
    loading,
    color = COLORS.secondary,
}) => {
    if (!loading) {
        return null;
    }

    return (
        <Modal
            animationInTiming={150}
            isVisible={loading}
            backdropOpacity={0.5}
            style={styles.modal}
            statusBarTranslucent={true}>
            <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                    animating={loading}
                    size="large"
                    color={color}
                />
            </View>
        </Modal>
    );
};
