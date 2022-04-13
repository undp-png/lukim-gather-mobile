import React from 'react';
import {Pressable, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import {Icon} from 'react-native-eva-icons';

import Button from 'components/Button';
import {_} from 'services/i18n';

import {Localize} from '@rna/components/I18n';

import styles from './styles';

interface Props {
    isOpenActions: boolean;
    onEditPress(): void;
    onDeletePress(): void;
    onBackdropPress(): void;
    isConfirmDeleteOpen: boolean;
    toggleCancelDelete(): void;
    toggleConfirmDelete(): void;
}
const SurveyActions: React.FC<Props> = ({
    isOpenActions,
    onEditPress,
    onDeletePress,
    onBackdropPress,
    isConfirmDeleteOpen,
    toggleCancelDelete,
    toggleConfirmDelete,
}) => {
    return (
        <Modal
            isVisible={isOpenActions}
            onBackdropPress={onBackdropPress}
            backdropTransitionOutTiming={10}
            style={
                isConfirmDeleteOpen ? styles.confirmModal : styles.actionModal
            }>
            {isConfirmDeleteOpen ? (
                <View style={styles.boxContent}>
                    <Text style={styles.heading}>
                        <Localize>Delete the entry?</Localize>
                    </Text>
                    <Text style={styles.message}>
                        <Localize>
                            Are you sure you want to delete the entry.
                        </Localize>
                    </Text>
                    <View style={styles.buttonsWrapper}>
                        <Button
                            title={_('Cancel')}
                            onPress={toggleCancelDelete}
                            style={styles.cancelButton}
                            lightGreen
                            light
                        />
                        <Button
                            title={_('Yes, delete')}
                            onPress={toggleConfirmDelete}
                            style={styles.confirmButton}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.options}>
                    <Pressable style={styles.option} onPress={onEditPress}>
                        <Icon
                            name="edit-2-outline"
                            height={25}
                            width={25}
                            fill={'#888C94'}
                        />
                        <Text style={styles.title}>
                            <Localize>Edit</Localize>
                        </Text>
                    </Pressable>
                    <Pressable style={styles.option} onPress={onDeletePress}>
                        <Icon
                            name="trash-2-outline"
                            height={25}
                            width={25}
                            fill={'#888C94'}
                        />
                        <Text style={styles.title}>
                            <Localize>Delete</Localize>
                        </Text>
                    </Pressable>
                </View>
            )}
        </Modal>
    );
};

export default SurveyActions;
