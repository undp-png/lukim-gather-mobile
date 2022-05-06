import React, {useCallback} from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

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

    return (
        <TouchableOpacity onPress={onPressItem} style={styles.item}>
            <View>
                <Text style={styles.title} title={item.title} />
                <View style={styles.category}>
                    <Image
                        source={
                            categoryIcon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                    <Text style={styles.field} title={item?.category?.title} />
                </View>
            </View>
            <View style={styles.rightData}>
                <Text style={styles.date} title={item.createdAt} />
            </View>
        </TouchableOpacity>
    );
};

export default SurveyItem;
