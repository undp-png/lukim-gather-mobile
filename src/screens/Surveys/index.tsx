import React, {useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {gql, useQuery} from '@apollo/client';

import Text from 'components/Text';
import {ModalLoader} from 'components/Loader';

import SurveyItem from 'components/SurveyItem';

import styles from './styles';

const GET_SURVEYS = gql`
    query GetSurveys {
        enviromentalSurveys {
            title
            description
            sentiment
            attachment {
                media
            }
        }
    }
`;

const Surveys = () => {
    const {loading, error, data} = useQuery(GET_SURVEYS);
    const navigation = useNavigation<any>();
    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onMapPress = useCallback<any>(
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
        ({
            item,
        }: {
            item: {
                title: string;
                icon: string;
                category: {title: string};
                created?: string;
            };
        }) => <SurveyItem item={item} />,
        [],
    );
    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <FlatList
                data={data?.enviromentalSurveys}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.title}
            />
        </View>
    );
};

export default Surveys;
