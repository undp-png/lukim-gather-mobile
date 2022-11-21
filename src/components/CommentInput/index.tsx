import React, {useState, useCallback, useEffect, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {_} from 'services/i18n';
import COLORS from 'utils/colors';

import {CommentType} from 'generated/types';

import styles from './styles';
import {TextInput} from 'react-native-gesture-handler';

interface Props {
    onPress: (message: string, comment?: CommentType | null) => void;
    setReply: (reply: CommentType | null) => void;
    reply?: CommentType | null;
}

const CommentInput: React.FC<Props> = ({onPress, reply, setReply}) => {
    const [message, setMessage] = useState<string>('');
    const [focus, setFocus] = useState<boolean>(false);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        reply && setFocus(true);
    }, [reply]);

    useEffect(() => {
        if (focus) {
            inputRef.current && inputRef?.current.focus();
        }
    }, [focus, inputRef]);

    const handleBlur = useCallback(() => {
        if (!message) {
            setReply(null);
        }
        setFocus(false);
    }, [message, setReply]);

    const handlePress = useCallback(() => {
        onPress?.(message, reply);
        setMessage('');
    }, [message, onPress, reply]);

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <View style={styles.commentInput}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder={_('Add a comment...')}
                        style={styles.input}
                        onBlur={handleBlur}
                        ref={inputRef}
                    />
                </View>
                <TouchableOpacity
                    onPress={handlePress}
                    disabled={message.trim() === ''}>
                    <Icon
                        name="paper-plane-outline"
                        width={24}
                        height={24}
                        fill={COLORS.orange}
                        style={styles.sendIcon}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default CommentInput;
