import React, {useEffect, useCallback, useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {RefreshControl, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import SurveyItem from 'components/SurveyItem';
import {ModalLoader} from 'components/Loader';

import styles from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_SURVEY = gql`
    query GetEnviromentalSurveys {
        enviromentalSurveys {
            id
            title
            description
            sentiment
            attachment {
                media
            }
            category {
                id
                title
            }
        }
    }
`;

const Surveys = () => {
    const navigation = useNavigation();

    const {loading, data, refetch} = useQuery(GET_SURVEY);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

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

    useFocusEffect(() => {
        refetch();
    });

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            {data && (
                <FlatList
                    data={data?.enviromentalSurveys}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={handleRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                />
            )}
        </View>
    );
};

export default Surveys;
