import React, {useCallback, useState, useRef} from 'react';
import {Image, View} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Text from 'components/Text';

import cs from '@rna/utils/cs';

import surveyCategory from 'services/data/surveyCategory.json';

import styles from './styles';

const keyExtractor = (item: {id: any}) => item.id;

const Category = ({category}: {category: any}) => {
    const renderSubCategory = useCallback(
        ({item}: {item: {icon: string; name: string; id: number}}) => (
            <TouchableOpacity style={styles.subCategory}>
                <View style={styles.iconWrapper}>
                    <Image
                        source={
                            item.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                </View>
                <Text style={styles.categoryName} title={item.name} />
            </TouchableOpacity>
        ),
        [],
    );
    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headerTitle} title={category.title} />
            </View>
            <FlatList
                style={styles.subCategoryList}
                numColumns={3}
                data={category.sub_category}
                renderItem={renderSubCategory}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

const ChooseCategory = () => {
    const categoryListRef = useRef<any>();
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
                        index: index,
                    });
                }}
                style={styles.menu}>
                <Text
                    style={cs(styles.menuTitle, [
                        item.id === activeCategory && styles.menuTitleActive,
                    ])}
                    title={item.title}
                />
            </TouchableOpacity>
        ),
        [activeCategory],
    );

    const renderCategory = useCallback(
        ({item}: {item: object}) => <Category category={item} />,
        [],
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.menuList}
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
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default ChooseCategory;
