import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, View, TextInput, useWindowDimensions} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import cs from '@rna/utils/cs';

import data from 'services/data/surveyCategory';

import styles from './styles';

const keyExtractor = (item: {id: any}) => item.id;

const Category = ({
    searchQuery,
    category,
    navigation,
}: {
    searchQuery: string;
    category: any;
    navigation: any;
}) => {
    const searchedCategory = useMemo(
        () =>
            category?.childs.filter(el =>
                `${el.name}`.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [category?.childs, searchQuery],
    );
    const handleCategoryPress = useCallback(
        categoryItem => {
            navigation.navigate('CreateSurvey', {
                categoryItem,
            });
        },
        [navigation],
    );
    const renderSubCategory = useCallback(
        ({item}: {item: {icon: string; name: string; id: number}}) => (
            <TouchableOpacity
                onPress={() => handleCategoryPress(item)}
                style={styles.subCategory}>
                <View style={styles.iconWrapper}>
                    <Image
                        source={
                            item.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryName} title={item.name} />
                </View>
                <Icon
                    name="arrow-ios-forward-outline"
                    height={20}
                    width={20}
                    fill={'#9fa3a9'}
                />
            </TouchableOpacity>
        ),
        [handleCategoryPress],
    );
    return (
        <FlatList
            data={searchedCategory}
            renderItem={renderSubCategory}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
        />
    );
};

const SearchCategory = () => {
    const navigation = useNavigation();
    const {width} = useWindowDimensions();
    const [searchQuery, setSearchQuery] = useState('');
    const onClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleSearchChange = useCallback(text => setSearchQuery(text), []);

    const renderCategory = useCallback(
        ({item}: {item: object}) => (
            <Category
                searchQuery={searchQuery}
                category={item}
                navigation={navigation}
            />
        ),
        [navigation, searchQuery],
    );

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

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.subCategoryList}
                data={data}
                renderItem={renderCategory}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default SearchCategory;
