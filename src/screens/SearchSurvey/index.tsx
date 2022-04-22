import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {View, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import {gql, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import SurveyItem from 'components/SurveyItem';
import Text from 'components/Text';

import cs from '@rna/utils/cs';

import styles from './styles';

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
    const {user} = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const navigation = useNavigation();
    const onClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleSearchChange = useCallback(text => setSearchQuery(text), []);

    const {loading, error, data} = useQuery(GET_SURVEY);

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

    const renderItem = ({item}: {item: object}) => <SurveyItem item={item} />;
    const searchedSurveys = useMemo(
        () =>
            data?.enviromentalSurveys.filter(el =>
                `${el.title}`.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [searchQuery, data],
    );

    const selectedData = useMemo(
        () =>
            selectedTab === user?.id
                ? searchedSurveys.filter(el => el.user === selectedTab)
                : searchedSurveys,
        [searchedSurveys, selectedTab, user],
    );

    const onSelectTabAll = useCallback(() => setSelectedTab(0), []);
    const onSelectTabMy = useCallback(() => setSelectedTab(user?.id), [user]);

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
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default SearchSurvey;
