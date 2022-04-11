import React, {useCallback} from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

import SurveyCategory from 'services/data/surveyCategory';
import useCategoryIcon from 'hooks/useCategoryIcon';

import styles from './styles';

const SurveyItem = ({
    item,
    onPress,
}: {
    item: {
        title: string;
        icon: string;
        category: {title: string};
        created?: string;
    };
    onPress(): void;
}) => {
    const navigation = useNavigation();
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(item?.category?.id),
    );
    const onPressItem = useCallback(
        () => navigation.navigate('SurveyItem', {item}),
        [item, navigation],
    );
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
                <Text style={styles.date} title={item.created} />
            </View>
        </TouchableOpacity>
    );
};

export default SurveyItem;
