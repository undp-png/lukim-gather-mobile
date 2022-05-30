import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Modal from 'react-native-modal';

import Button from 'components/Button';
import cs from '@rna/utils/cs';

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
    isLogoutBox?: boolean;
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
    isLogoutBox,
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
                    <View
                        style={cs(styles.buttonsRight, [
                            styles.logoutButtonWrapper,
                            isLogoutBox,
                        ])}>
                        <Button
                            title={positiveText}
                            onPress={onPositive}
                            style={
                                isLogoutBox
                                    ? styles.logoutButton
                                    : styles.buttonPositive
                            }
                        />
                        {onCancel && (
                            <Button
                                style={cs(isLogoutBox && styles.logoutButton)}
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
