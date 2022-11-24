import React, {useCallback, useMemo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';
import useCategoryIcon from 'hooks/useCategoryIcon';

import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';
import {HappeningSurveyType} from 'generated/types';

import styles from './styles';

interface SurveyItemProps {
    item: HappeningSurveyType;
    onPress?: (item: HappeningSurveyType) => void;
}

const SurveyItem = ({item, onPress}: SurveyItemProps) => {
    const navigation = useNavigation<StackNavigationProp<StackParamList>>();
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

    const [dateFormat, formatted] = useMemo(() => {
        const date = new Date(item.modifiedAt);
        return [date, date.toString()];
    }, [item]);

    return (
        <TouchableOpacity onPress={onPressItem} style={styles.item}>
            <Text style={styles.title} title={item.title} />
            <View style={styles.bottomData}>
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
                        title={_(item?.category?.title as string)}
                    />
                </View>
                <Text
                    style={styles.date}
                    title={`${formatted.substring(
                        4,
                        7,
                    )} ${dateFormat.getDate()}, ${dateFormat.getFullYear()}`}
                />
            </View>
            {item.isOffline && (
                <View style={styles.offlineIndicator}>
                    <Icon
                        name="wifi-off-outline"
                        height={14}
                        width={14}
                        fill="#fff"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default SurveyItem;
