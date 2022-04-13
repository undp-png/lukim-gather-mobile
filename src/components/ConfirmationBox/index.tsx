import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Modal from 'react-native-modal';

import Button from 'components/Button';
import {_} from 'services/i18n';

import {Localize} from '@rna/components/I18n';

import styles from './styles';

interface BoxProps {
    isOpen: boolean;
    onCancel(): void;
    onLogout(): void;
}

const deviceHeight = Dimensions.get('window').height;

export const ConfirmBox: React.FC<BoxProps> = ({
    isOpen,
    onCancel,
    onLogout,
}) => {
    return (
        <Modal
            animationInTiming={150}
            isVisible={isOpen}
            backdropOpacity={0.5}
            style={styles.modal}
            statusBarTranslucent={true}
            deviceHeight={deviceHeight}>
            <View style={styles.boxContent}>
                <Text style={styles.heading}>
                    <Localize>Log out</Localize>
                </Text>
                <Text style={styles.message}>
                    <Localize>Are you sure you want to log out?</Localize>
                </Text>
                <View style={styles.buttonsWrapper}>
                    <Button
                        title={_('Cancel')}
                        onPress={onCancel}
                        style={styles.login}
                        lightGreen
                        light
                    />
                    <Button
                        title={_('Yes, log out')}
                        onPress={onLogout}
                        style={styles.getStarted}
                    />
                </View>
            </View>
        </Modal>
    );
};
