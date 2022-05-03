import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Modal from 'react-native-modal';

import Button from 'components/Button';
import {_} from 'services/i18n';

import styles from './styles';

interface BoxProps {
    isOpen: boolean;
    headerText: string;
    descriptionText?: string;
    onCancel(): void;
    positiveText: string;
    onPositive(): void;
    negativeText?: string;
    onNegative?(): void;
}

const deviceHeight = Dimensions.get('window').height;

export const ConfirmBox: React.FC<BoxProps> = ({
    isOpen,
    headerText,
    descriptionText,
    onCancel,
    positiveText,
    onPositive,
    negativeText,
    onNegative,
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
                <Text style={styles.heading}>{headerText}</Text>
                <Text style={styles.message}>{descriptionText}</Text>
                <View style={styles.buttonsWrapper}>
                    {!!negativeText && (
                        <Button
                            title={negativeText}
                            onPress={onNegative}
                            style={styles.buttonNegative}
                        />
                    )}
                    <View style={styles.buttonsRight}>
                        <Button
                            title={positiveText}
                            onPress={onPositive}
                            style={styles.buttonPositive}
                        />
                        {onCancel && (
                            <Button
                                title={_('Cancel')}
                                onPress={onCancel}
                                outline
                                dark
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
