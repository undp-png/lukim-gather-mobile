import React, {useCallback} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

import styles from './styles';

const HomeHeader = () => {
    const navigation = useNavigation();
    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onListPress = useCallback(
        () => navigation.navigate('Surveys'),
        [navigation],
    );
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onSearchPress} style={styles.searchBar}>
                <Icon
                    name="search-outline"
                    height={22}
                    width={22}
                    fill={'#888C94'}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={onListPress} style={styles.menuBar}>
                <Icon
                    name="list-outline"
                    height={22}
                    width={22}
                    fill={'#0D4979'}
                />
                <Text style={styles.title} title="List" />
            </TouchableOpacity>
        </View>
    );
};

export default HomeHeader;
