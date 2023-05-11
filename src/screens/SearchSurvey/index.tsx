import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
    View,
    TextInput,
    ListRenderItem,
    useWindowDimensions,
} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import SurveyItem from 'components/SurveyItem';
import Text from 'components/Text';
import {Loader} from 'components/Loader';
import EmptyListMessage from 'components/EmptyListMessage';
import SurveyListTab from 'components/SurveyListTab';

import useQuery from 'hooks/useQuery';

import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {HappeningSurveyType} from '@generated/types';

import styles from './styles';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const SearchSurvey = () => {
    const {width} = useWindowDimensions();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const navigation = useNavigation();
    const onClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleSearchChange = useCallback(text => setSearchQuery(text), []);

    const {loading, error, data} = useQuery(GET_HAPPENING_SURVEY, {
        variables: {ordering: '-modified_at'},
    });

    useEffect(() => {
        const inputWidth = {
            width: width - 136,
        };
        const wrapperWidth = {
            width: width - 70,
        };
        navigation.setOptions({
            headerTitle: () => (
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
                        autoFocus={true}
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
    }, [handleSearchChange, navigation, onClearSearch, searchQuery, width]);

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

    return (
        <View style={styles.container}>
            <SurveyListTab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <FlatList
                data={selectedData}
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
