import React, {useEffect, useCallback, useState} from 'react';
import {
    RefreshControl,
    View,
    ListRenderItem,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import SurveyItem from 'components/SurveyItem';
import EmptyListMessage from 'components/EmptyListMessage';

import useQuery from 'hooks/useQuery';

import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import {HappeningSurveyType} from '@generated/types';

import styles from './styles';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const Surveys = () => {
    const navigation = useNavigation();

    const {loading, data, refetch} = useQuery(GET_HAPPENING_SURVEY);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);
    useFocusEffect(handleRefresh);

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

    const renderItem: ListRenderItem<HappeningSurveyType> = useCallback(
        ({item}: {item: HappeningSurveyType}) => <SurveyItem item={item} />,
        [],
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data?.happeningSurveys || []}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
                ListEmptyComponent={loading ? null : EmptyListMessage}
            />
        </View>
    );
};

export default Surveys;
