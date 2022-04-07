import React from 'react';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';

import Button from 'components/Button';

import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

interface BoxProps {
    isOpen: boolean;
    onCancel(): void;
    onLogout(): void;
}

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
            statusBarTranslucent={true}>
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
