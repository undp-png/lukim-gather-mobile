import React from 'react';
import {View, Dimensions, Text} from 'react-native';
import Modal from 'react-native-modal';

import Button from 'components/Button';

import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

interface BoxProps {
    isOpen: boolean;
    onCancel(): void;
    onSubmit(): void;
}

const deviceHeight = Dimensions.get('window').height;

export const SurveyConfirmBox: React.FC<BoxProps> = ({
    isOpen,
    onCancel,
    onSubmit,
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
