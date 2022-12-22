import React from 'react';
import {Pressable, View} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import Modal from 'components/Modal';
import {_} from 'services/i18n';

import styles from './styles';
import COLORS from 'utils/colors';

interface Props {
    isOpenCommentAction: boolean;
    onBackdropPress(): void;
    onClickDeleteComment(): void;
    onClickEditComment(): void;
}

const ActionItem = ({
    onPress,
    title,
    icon,
}: {
    onPress?(): void;
    title: string;
    icon: string;
}) => {
    return (
        <Pressable style={styles.option} onPress={onPress}>
            <Icon
                name={icon}
                fill={COLORS.orange}
                width={20}
                height={20}
                style={styles.icon}
            />
            <Text style={styles.title} title={title} />
        </Pressable>
    );
};

const CommentActions: React.FC<Props> = ({
    isOpenCommentAction,
    onBackdropPress,
    onClickDeleteComment,
    onClickEditComment,
}) => {
    return (
        <Modal
            isVisible={isOpenCommentAction}
            onBackdropPress={onBackdropPress}
            style={styles.actionModal}>
            <View style={styles.options}>
                <ActionItem
                    title={_('Delete')}
                    onPress={onClickDeleteComment}
                    icon="trash-2-outline"
                />
                <ActionItem
                    title={_('Edit')}
                    onPress={onClickEditComment}
                    icon="edit-2-outline"
                />
            </View>
        </Modal>
    );
};

export default CommentActions;
