import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {
    RefreshControl,
    TextInput,
    View,
    ListRenderItem,
    TouchableOpacity,
    FlatList,
    useWindowDimensions,
} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import SurveyItem from 'components/SurveyItem';
import EmptyListMessage from 'components/EmptyListMessage';
import SurveyListTab from 'components/SurveyListTab';

import useQuery from 'hooks/useQuery';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import {HappeningSurveyType} from '@generated/types';

import styles from './styles';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const Surveys = () => {
    const {width} = useWindowDimensions();
    const navigation = useNavigation();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const {loading, data, refetch} = useQuery(GET_HAPPENING_SURVEY);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');

    const onClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleSearchChange = useCallback(text => setSearchQuery(text), []);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);
    useFocusEffect(handleRefresh);

    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onMapPress = useCallback(
        () => navigation.navigate('HomeScreen'),
        [navigation],
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={onMapPress} style={styles.menuBar}>
                    <Icon name="map" height={22} width={22} fill={'#0D4979'} />
                    <Text style={styles.title} title={_('Map')} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, onMapPress, onSearchPress]);

    const searchedSurveys = useMemo(
        () =>
            data?.happeningSurveys.filter((el: HappeningSurveyType) =>
                `${el.title}`.toLowerCase().includes(searchQuery.toLowerCase()),
            ) ?? [],
        [searchQuery, data],
    );

    const selectedData = useMemo(
        () =>
            selectedTab === 'myentries'
                ? searchedSurveys.filter(
                      (el: HappeningSurveyType) =>
                          el.createdBy?.id && el.createdBy?.id === user?.id,
                  )
                : searchedSurveys,
        [searchedSurveys, selectedTab, user],
    );

    const renderItem: ListRenderItem<HappeningSurveyType> = useCallback(
        ({item}: {item: HappeningSurveyType}) => <SurveyItem item={item} />,
        [],
    );

    const inputWidth = useMemo(() => {
        return {width: width - 100};
    }, [width]);

    const wrapperWidth = useMemo(() => {
        return {width: width - 40};
    }, [width]);

    return (
        <View style={styles.container}>
            <View style={cs(styles.searchWrapper, wrapperWidth)}>
                <Icon
                    name="search-outline"
                    height={20}
                    width={20}
                    fill={'#888C94'}
                />
                <TextInput
                    style={cs(styles.searchInput, inputWidth)}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={onClearSearch}>
                        <Icon
                            name="close-circle"
                            height={20}
                            width={20}
                            fill={'#888C94'}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <SurveyListTab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <FlatList
                data={selectedData || []}
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
