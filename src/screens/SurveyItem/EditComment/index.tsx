import React, {useCallback, useEffect, useState} from 'react';

import InputField from 'components/InputField';
import Modal from 'components/Modal';

import styles from './styles';
import {Keyboard, KeyboardEvent, View} from 'react-native';

import cs from '@rna/utils/cs';
import {Icon} from 'react-native-eva-icons';
import COLORS from 'utils/colors';
import {TouchableOpacity} from 'react-native';

interface Props {
    message: string | undefined;
    isOpen: boolean;
    onPress(value: string): void;
    onBackdropPress(): void;
}

const EditComment: React.FC<Props> = ({
    message,
    isOpen,
    onPress,
    onBackdropPress,
}) => {
    const [editMessage, setEditMessage] = useState<string>('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        message && setEditMessage(message);
        const onKeyboardDidShow = (e: KeyboardEvent) => {
            setKeyboardHeight(e.endCoordinates.height);
        };
        const onKeyboardDidHide = () => {
            setKeyboardHeight(0);
        };
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            onKeyboardDidShow,
        );
        const hideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            onKeyboardDidHide,
        );
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [message]);

    const handlePress = useCallback(() => {
        onPress?.(editMessage);
    }, [onPress, editMessage]);

    return (
        <Modal
            isVisible={isOpen}
            style={cs(styles.actionModal, [
                {marginBottom: keyboardHeight},
                keyboardHeight,
            ])}
            onBackdropPress={onBackdropPress}>
            <View style={styles.container}>
                <InputField
                    inputStyle={styles.input}
                    containerStyle={styles.inputContainer}
                    value={editMessage}
                    onChangeText={setEditMessage}
                    multiline={true}
                />
                <TouchableOpacity
                    onPress={handlePress}
                    disabled={editMessage?.trim() === ''}>
                    <Icon
                        name="paper-plane-outline"
                        width={24}
                        height={24}
                        fill={COLORS.orange}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default EditComment;
