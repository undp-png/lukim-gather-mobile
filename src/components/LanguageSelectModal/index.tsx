import React, {useCallback} from 'react';
import {View} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Text from 'components/Text';

import RadioButton from '@rna/components/forms/RadioInput/RadioButton';
import {useI18nContext} from '@rna/components/I18n';

import COLORS from 'utils/colors';

import styles from './styles';

const codeExtractor = item => item.code;

const Option = ({
    selected,
    item,
    onPress,
}: {
    selected: boolean;
    item: {title: string};
    onPress(): void;
}) => {
    const handlePress = useCallback(() => {
        onPress(item);
    }, [item, onPress]);

    return (
        <TouchableOpacity style={styles.option} onPress={handlePress}>
            <Text style={styles.text} title={item.title} />
            <RadioButton
                selected={selected}
                color={COLORS.accent}
                onPress={handlePress}
                size="small"
            />
        </TouchableOpacity>
    );
};

const LanguageSelectModal = props => {
    const {onSelect, ...modalProps} = props;

    const {languages, selectedLanguage} = useI18nContext();

    const renderOptionItem = useCallback(
        ({item}) => (
            <Option
                item={item}
                selected={item.code === selectedLanguage}
                onPress={onSelect}
            />
        ),
        [onSelect, selectedLanguage],
    );

    return (
        <Modal style={styles.modal} {...modalProps}>
            <View style={styles.options}>
                <FlatList
                    data={languages}
                    keyExtractor={codeExtractor}
                    renderItem={renderOptionItem}
                />
            </View>
        </Modal>
    );
};

export default LanguageSelectModal;
