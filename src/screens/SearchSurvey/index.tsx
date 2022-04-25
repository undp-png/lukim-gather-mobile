import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {View, TextInput, ListRenderItem} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {gql, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';

import SurveyItem from 'components/SurveyItem';
import Text from 'components/Text';
import {Loader} from 'components/Loader';

import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {HappeningSurveyType} from 'generated/types';

import styles from './styles';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const TabItem = ({
    onPress,
    title,
    active,
    id,
}: {
    onPress(): void;
    title: string;
    active: number;
    id: number;
}) => {
    return (
        <TouchableOpacity
            style={cs(styles.tabItem, [styles.activeTabItem, active === id])}
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
    const [selectedTab, setSelectedTab] = useState(0);
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
            selectedTab === user?.id
                ? searchedSurveys.filter(
                      (el: HappeningSurveyType) =>
                          el.createdBy?.id === selectedTab,
                  )
                : searchedSurveys,
        [searchedSurveys, selectedTab, user],
    );

    const onSelectTabAll = useCallback(() => setSelectedTab(0), []);
    const onSelectTabMy = useCallback(() => {
        if (!isAuthenticated) {
            return Toast.show(_('You are not logged in!'));
        }
        setSelectedTab(user?.id);
    }, [user, isAuthenticated]);

    return (
        <View style={styles.container}>
            <View style={styles.tabWrapper}>
                <TabItem
                    active={selectedTab}
                    id={0}
                    title="All"
                    onPress={onSelectTabAll}
                />
                <TabItem
                    active={selectedTab}
                    id={user?.id}
                    title="My Entries"
                    onPress={onSelectTabMy}
                />
            </View>
            <FlatList
                data={selectedTab ? selectedData : searchedSurveys}
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
                            <Text
                                style={styles.message}
                                title={_('No entries found!')}
                            />
                        ) : null}
                    </React.Fragment>
                }
            />
        </View>
    );
};

export default SearchSurvey;
