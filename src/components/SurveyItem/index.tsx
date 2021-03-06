import React, {useCallback} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';
import useCategoryIcon from 'hooks/useCategoryIcon';

import {HappeningSurveyType} from 'generated/types';

import styles from './styles';

interface SurveyItemProps {
    item: HappeningSurveyType;
    onPress?: (item: HappeningSurveyType) => void;
}

const SurveyItem = ({item, onPress}: SurveyItemProps) => {
    const navigation = useNavigation();
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(item?.category?.id),
    );
    const onPressItem = useCallback(() => {
        if (onPress) {
            return onPress(item);
        }
        navigation.navigate('SurveyItem', {item});
    }, [item, navigation, onPress]);

    const dateFormat = new Date(item.createdAt);
    const formatted = dateFormat.toString();

    return (
        <TouchableOpacity onPress={onPressItem} style={styles.item}>
            <View style={styles.leftData}>
                <Text style={styles.title} title={item.title} />
                <View style={styles.category}>
                    <Image
                        source={
                            categoryIcon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                    <Text
                        style={styles.field}
                        title={_(item?.category?.title)}
                    />
                </View>
            </View>
            <View style={styles.rightData}>
                <Text
                    style={styles.date}
                    title={`${formatted.substring(
                        4,
                        7,
                    )} ${dateFormat.getDate()}, ${dateFormat.getFullYear()}`}
                />
            </View>
        </TouchableOpacity>
    );
};

export default SurveyItem;
