import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {View, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import SurveyItem from 'components/SurveyItem';
import Text from 'components/Text';

import cs from '@rna/utils/cs';

import surveys from 'services/data/surveys.json';

import styles from './styles';

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
    const userId = 3;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState(1);
    const navigation = useNavigation();
    const onClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleSearchChange = useCallback(text => setSearchQuery(text), []);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.searchWrapper}>
                    <Icon
                        name="search-outline"
                        height={23}
                        width={23}
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
                                height={23}
                                width={23}
                                fill={'#0D4979'}
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

    const renderItem = ({item}: {item: object}) => (
        <SurveyItem item={item} onPress={() => {}} />
    );
    const searchedSurveys = useMemo(
        () =>
            surveys.filter(el =>
                `${el.title}`.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [searchQuery],
    );

    const selectedData = useMemo(
        () =>
            selectedTab === userId
                ? searchedSurveys.filter(el => el.user === selectedTab)
                : searchedSurveys,
        [searchedSurveys, selectedTab],
    );

    const onSelectTabAll = useCallback(() => setSelectedTab(1), []);
    const onSelectTabMy = useCallback(() => setSelectedTab(userId), []);

    return (
        <View style={styles.container}>
            <View style={styles.tabWrapper}>
                <TabItem
                    active={selectedTab}
                    id={1}
                    title="All"
                    onPress={onSelectTabAll}
                />
                <TabItem
                    active={selectedTab}
                    id={userId}
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
