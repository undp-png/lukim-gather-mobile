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
    vertical?: boolean;
}

const deviceHeight = Dimensions.get('window').height;

export const ConfirmBox: React.FC<BoxProps> = ({
    isOpen,
    headerText,
    descriptionText,
    onCancel,
    positiveText,
    onPositive,
    vertical,
    negativeText,
    onNegative,
    isLogoutBox,
}) => {
    return (
        <Modal
            animationInTiming={150}
            isVisible={isOpen}
            backdropOpacity={0.5}
            onBackdropPress={onCancel}
            style={styles.modal}
            statusBarTranslucent={true}
            deviceHeight={deviceHeight}>
            <View style={styles.boxContent}>
                <Text style={styles.heading}>{headerText}</Text>
                <Text style={styles.message}>{descriptionText}</Text>
                <View style={styles.buttonsWrapper}>
                    <View
                        style={cs(
                            styles.buttonsRight,
                            [styles.logoutButtonWrapper, isLogoutBox],
                            [styles.buttonsRightVertical, vertical],
                        )}>
                        <Button
                            title={positiveText}
                            onPress={onPositive}
                            style={cs(
                                [styles.logoutButton, isLogoutBox],
                                [styles.buttonPositive, !vertical],
                                [styles.buttonPositiveVertical, vertical],
                            )}
                        />
                        {!!negativeText && (
                            <Button
                                outline
                                title={negativeText}
                                onPress={onNegative}
                                style={styles.buttonNegative}
                                textStyle={styles.buttonNegativeText}
                            />
                        )}
                        {onCancel && (
                            <Button
                                style={cs(
                                    isLogoutBox && styles.logoutButton,
                                    styles.cancel,
                                )}
                                title={_('Cancel')}
                                onPress={onCancel}
                                outline
                                textStyle={
                                    isLogoutBox
                                        ? styles.logoutText
                                        : styles.cancelText
                                }
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
