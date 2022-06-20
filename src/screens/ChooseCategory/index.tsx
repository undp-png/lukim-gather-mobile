import React, {useCallback, useState, useRef, useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, View, useWindowDimensions} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

import {_} from 'services/i18n';
import Text from 'components/Text';
import {SearchIcon} from 'components/HeaderButton';

import cs from '@rna/utils/cs';

import surveyCategory from 'services/data/surveyCategory';

import styles from './styles';

const keyExtractor = (item: {id: any}) => item.id;

const Category = ({category, navigation}: {category: any; navigation: any}) => {
    const {width} = useWindowDimensions();
    const handleCategoryPress = useCallback(
        categoryItem => {
            navigation.navigate('CreateSurvey', {
                categoryItem,
            });
        },
        [navigation],
    );
    const wrapperWidth = useMemo(() => {
        return {width: (width - 50) / 3};
    }, [width]);
    const renderSubCategory = useCallback(
        ({item}: {item: {icon: string; name: string; id: number}}) => (
            <TouchableOpacity
                onPress={() => handleCategoryPress(item)}
                style={styles.subCategory}>
                <View style={cs(styles.iconWrapper, wrapperWidth)}>
                    <Image
                        source={
                            item.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                </View>
                <Text
                    style={cs(styles.categoryName, wrapperWidth)}
                    title={_(item.name)}
                />
            </TouchableOpacity>
        ),
        [handleCategoryPress, wrapperWidth],
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SearchIcon
                    onSearchPress={() => navigation.navigate('SearchCategory')}
                />
            ),
        });
    }, [navigation]);
    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headerTitle} title={_(category.title)} />
            </View>
            <FlatList
                style={styles.subCategoryList}
                numColumns={3}
                data={category?.childs}
                renderItem={renderSubCategory}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

const ChooseCategory = () => {
    const categoryListRef = useRef<any>();
    const navigation = useNavigation();

    const [activeCategory, setActiveCategory] = useState<number>(
        surveyCategory[0].id,
    );

    const renderMenu = useCallback(
        ({item, index}: {item: {title: string; id: number}; index: number}) => (
            <TouchableOpacity
                onPress={() => {
                    setActiveCategory(item.id);
                    categoryListRef?.current?.scrollToIndex({
                        animated: true,
                        index,
                    });
                }}
                style={styles.menu}>
                <Text
                    style={cs(styles.menuTitle, [
                        item.id === activeCategory && styles.menuTitleActive,
                    ])}
                    title={_(item.title)}
                />
            </TouchableOpacity>
        ),
        [activeCategory],
    );

    const renderCategory = useCallback(
        ({item}: {item: object}) => (
            <Category category={item} navigation={navigation} />
        ),
        [navigation],
    );

    const handleViewableItemsChanged = useCallback(({viewableItems}) => {
        if (viewableItems?.length > 0) {
            setActiveCategory(viewableItems[0].item.id);
        }
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.menuItemsContainer}
                data={surveyCategory}
                renderItem={renderMenu}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
            />
            <FlatList
                ref={categoryListRef}
                data={surveyCategory}
                renderItem={renderCategory}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 75,
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default ChooseCategory;
