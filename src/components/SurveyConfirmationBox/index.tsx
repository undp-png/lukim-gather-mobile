import React, {useCallback, useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

import Button from 'components/Button';

import {Localize} from '@rna/components/I18n';

import {_} from 'services/i18n';

import styles from './styles';
import {Icon} from 'react-native-eva-icons';

interface BoxProps {
    isOpen: boolean;
    onCancel(): void;
    onSubmit(): void;
    updateAnonymousStatus: (value: boolean) => void;
}

const deviceHeight = Dimensions.get('window').height;

export const SurveyConfirmBox: React.FC<BoxProps> = ({
    isOpen,
    onCancel,
    onSubmit,
    updateAnonymousStatus,
}) => {
    const [isChecked, setIschecked] = useState(false);
    const toggleCheckBox = useCallback(() => {
        setIschecked(!isChecked);
        updateAnonymousStatus(!isChecked);
    }, [isChecked, updateAnonymousStatus]);
    return (
        <Modal
            animationInTiming={150}
            isVisible={isOpen}
            backdropOpacity={0.5}
            style={styles.modal}
            statusBarTranslucent={true}
            deviceHeight={deviceHeight}>
            <View style={styles.boxContent}>
                <View style={styles.checkWrapper}>
                    <TouchableOpacity onPress={toggleCheckBox}>
                        <Icon
                            name={
                                isChecked
                                    ? 'checkmark-square-2'
                                    : 'square-outline'
                            }
                            height={26}
                            width={26}
                            fill={isChecked ? '#00518B' : '#585D69'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.message}>
                        Please check this box if you want to publish anonymously
                    </Text>
                </View>
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
