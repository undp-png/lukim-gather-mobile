import React from 'react';
import {Pressable, View} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import Modal from 'components/Modal';
import Button from 'components/Button';
import {_} from 'services/i18n';

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
            style={
                isConfirmDeleteOpen ? styles.confirmModal : styles.actionModal
            }>
            {isConfirmDeleteOpen ? (
                <View style={styles.boxContent}>
                    <Text
                        style={styles.heading}
                        title={_('Delete the entry?')}
                    />
                    <Text
                        style={styles.message}
                        title={_('Are you sure you want to delete the entry.')}
                    />
                    <View style={styles.buttonsWrapper}>
                        <Button
                            title={_('Cancel')}
                            onPress={toggleCancelDelete}
                            style={styles.cancelButton}
                            outline
                            dark
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
                        <Text style={styles.title} title={_('Edit')} />
                    </Pressable>
                    <Pressable style={styles.option} onPress={onDeletePress}>
                        <Icon
                            name="trash-2-outline"
                            height={25}
                            width={25}
                            fill={'#888C94'}
                        />
                        <Text style={styles.title} title={_('Delete')} />
                    </Pressable>
                </View>
            )}
        </Modal>
    );
};

export default SurveyActions;
