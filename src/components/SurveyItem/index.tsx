import React, {useCallback} from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

import styles from './styles';

const SurveyItem = ({item}: {item: object}) => {
    const navigation = useNavigation();
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
                            item.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                    <Text style={styles.field} title={item.category.title} />
                </View>
            </View>
            <View style={styles.rightData}>
                <Text style={styles.date} title={item.created} />
            </View>
        </TouchableOpacity>
    );
};

export default SurveyItem;
