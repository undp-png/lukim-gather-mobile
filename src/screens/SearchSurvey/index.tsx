import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {View, TextInput, ListRenderItem} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';

import SurveyItem from 'components/SurveyItem';
import Text from 'components/Text';
import {Loader} from 'components/Loader';
import EmptyListMessage from 'components/EmptyListMessage';

import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {HappeningSurveyType} from '@generated/types';

import styles from './styles';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const TabItem = ({
    onPress,
    title,
    activeTab,
    name,
}: {
    onPress(): void;
    title: string;
    activeTab: string;
    name: string;
}) => {
    return (
        <TouchableOpacity
            style={cs(styles.tabItem, [
                styles.activeTabItem,
                activeTab === name,
            ])}
            onPress={onPress}>
            <Text style={styles.tabTitle} title={title} />
        </TouchableOpacity>
    );
};

const SearchSurvey = () => {
    const {user, isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const navigation = useNavigation();
    const onClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleSearchChange = useCallback(text => setSearchQuery(text), []);

    const {loading, error, data} = useQuery(GET_HAPPENING_SURVEY);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.searchWrapper}>
                    <Icon
                        name="search-outline"
                        height={20}
                        width={20}
                        fill={'#888C94'}
                    />
                    <TextInput
                        style={styles.searchInput}
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
            ),
            headerStyle: {
                backgroundColor: '#E7ECF2',
                shadowColor: 'transparent',
            },
        });
    }, [handleSearchChange, navigation, onClearSearch, searchQuery]);

    const renderItem: ListRenderItem<HappeningSurveyType> = ({
        item,
    }: {
        item: HappeningSurveyType;
    }) => <SurveyItem item={item} />;

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

    const handleAllTabSelect = useCallback(() => setSelectedTab('all'), []);
    const handleMyTabSelect = useCallback(() => {
        if (!isAuthenticated) {
            return Toast.show(_('You are not logged in!'));
        }
        setSelectedTab('myentries');
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>
            <View style={styles.tabWrapper}>
                <TabItem
                    name="all"
                    activeTab={selectedTab}
                    title="All"
                    onPress={handleAllTabSelect}
                />
                <TabItem
                    name="myentries"
                    activeTab={selectedTab}
                    title="My Entries"
                    onPress={handleMyTabSelect}
                />
            </View>
            <FlatList
                data={selectedTab === 'all' ? selectedData : searchedSurveys}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
                ListEmptyComponent={
                    <React.Fragment>
                        <Loader loading={loading} />
                        {error ? (
                            <Text
                                style={styles.message}
                                title={getErrorMessage(error)}
                            />
                        ) : !loading ? (
                            <EmptyListMessage />
                        ) : null}
                    </React.Fragment>
                }
            />
        </View>
    );
};

export default SearchSurvey;
