import React from 'react';
import {View, Text} from 'react-native';

import Modal from 'components/Modal';
import Button from 'components/Button';

import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

interface BoxProps {
    isOpen: boolean;
    onCancel(): void;
    onSubmit(): void;
}

export const SurveyConfirmBox: React.FC<BoxProps> = ({
    isOpen,
    onCancel,
    onSubmit,
}) => {
    return (
        <Modal
            isVisible={isOpen}
            style={styles.modal}
            onBackdropPress={onCancel}>
            <View style={styles.boxContent}>
                <Text style={styles.heading}>
                    <Localize>Publish Survey?</Localize>
                </Text>
                <View style={styles.buttonsWrapper}>
                    <Button
                        title={_('Cancel')}
                        onPress={onCancel}
                        style={styles.login}
                        outline
                        dark
                    />
                    <Button
                        title={_('Publish')}
                        onPress={onSubmit}
                        style={styles.getStarted}
                    />
                </View>
            </View>
        </Modal>
    );
};
