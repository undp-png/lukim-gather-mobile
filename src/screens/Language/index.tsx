import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Text from 'components/Text';
import {_} from 'services/i18n';
import {dispatchLocale} from 'services/dispatch';

import RadioButton from '@rna/components/forms/RadioInput/RadioButton';
import {useI18nContext} from '@rna/components/I18n';

import COLORS from 'utils/colors';

import styles from './styles';

const codeExtractor = (item: {title: string; code: string}) => item.code;

const Option = ({
    selected,
    item,
    handlePress,
}: {
    selected: boolean;
    item: {title: string; code: string};
    handlePress: Function;
}) => {
    const onPress = useCallback(() => {
        handlePress(item.code);
    }, [handlePress, item.code]);
    return (
        <TouchableOpacity style={styles.option} onPress={onPress}>
            <RadioButton
                selected={selected}
                color={COLORS.blueText}
                onPress={onPress}
                size="small"
            />
            <Text style={styles.text} title={item.title} />
        </TouchableOpacity>
    );
};

const Language = () => {
    const navigation = useNavigation();
    const {languages, selectedLanguage} = useI18nContext();
    const {changeLanguage} = useI18nContext();

    const onSelectLanguage = useCallback(
        code => {
            changeLanguage(code);
            dispatchLocale(code);
            navigation.goBack();
        },
        [changeLanguage, navigation],
    );

    const renderOptionItem = useCallback(
        ({item}) => (
            <Option
                item={item}
                selected={item.code === selectedLanguage}
                handlePress={onSelectLanguage}
            />
        ),
        [onSelectLanguage, selectedLanguage],
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={languages}
                keyExtractor={codeExtractor}
                renderItem={renderOptionItem}
            />
        </View>
    );
};

export default Language;
