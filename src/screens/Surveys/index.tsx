import React, {useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import SurveyItem from 'components/SurveyItem';

import surveys from 'services/data/surveys.json';

import styles from './styles';

const Surveys = () => {
    const navigation = useNavigation();
    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onMapPress = useCallback(
        () => navigation.navigate('Home'),
        [navigation],
    );
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={onSearchPress}
                    style={styles.searchBar}>
                    <Icon
                        name="search-outline"
                        height={22}
                        width={22}
                        fill={'#888C94'}
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={onMapPress} style={styles.menuBar}>
                    <Icon name="map" height={22} width={22} fill={'#0D4979'} />
                    <Text style={styles.title} title="Map" />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: '#E7ECF2',
                shadowColor: 'transparent',
            },
        });
    }, [navigation, onMapPress, onSearchPress]);
    const renderItem = useCallback(
        ({item}: {item: object}) => <SurveyItem item={item} />,
        [],
    );
    return (
        <View style={styles.container}>
            <FlatList
                data={surveys}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default Surveys;
