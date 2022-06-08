import React, {useCallback, useMemo} from 'react';
import {View, Image, Pressable, useWindowDimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import Modal from 'components/Modal';
import Text from 'components/Text';

import {_} from 'services/i18n';
import COLORS from 'utils/colors';

import cs from '@rna/utils/cs';

import surveyCategory from 'services/data/surveyCategory';

import styles from './styles';

const keyExtractor = (item: {id: any}) => item.id;

interface CategoryProps {
    category: any;
    setCategory(item: {icon: string; name: string; id: number}): void;
    setOpenCategory(arg0: boolean): void;
}

const Category: React.FC<CategoryProps> = props => {
    const {category, setOpenCategory} = props;
    const {width} = useWindowDimensions();
    const itemWidth = useMemo(() => {
        return {width: (width - 100) / 3};
    }, [width]);
    const renderSubCategory = useCallback(
        ({item}: {item: {icon: string; name: string; id: number}}) => (
            <Pressable
                onPress={() => {
                    props.setCategory(item);
                    setOpenCategory(false);
                }}
                style={styles.subCategory}>
                <View style={cs(styles.iconWrapper, itemWidth)}>
                    <Image
                        source={
                            item.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                </View>
                <Text
                    style={cs(styles.categoryName, itemWidth)}
                    title={item.name}
                />
            </Pressable>
        ),
        [props, setOpenCategory, itemWidth],
    );
    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headerTitle} title={category.title} />
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

interface BoxProps {
    isOpen: boolean;
    onToggleModal(): void;
    setOpenCategory(): void;
    setCategory(): void;
}

const CategoryListModal: React.FC<BoxProps> = ({
    isOpen,
    onToggleModal,
    setCategory,
    setOpenCategory,
}) => {
    const renderCategory = useCallback(
        ({item}: {item: object}) => (
            <Category
                setCategory={setCategory}
                setOpenCategory={setOpenCategory}
                category={item}
            />
        ),
        [setCategory, setOpenCategory],
    );
    return (
        <Modal
            isVisible={isOpen}
            style={styles.modal}
            onBackdropPress={onToggleModal}>
            <View style={styles.boxContent}>
                <View style={styles.modalHeader}>
                    <Pressable
                        onPress={onToggleModal}
                        style={styles.closeWrapper}>
                        <Icon
                            name="close-circle-outline"
                            height={25}
                            width={25}
                            fill={COLORS.tertiary}
                        />
                    </Pressable>
                    <Text style={styles.heading} title="Select the Category" />
                </View>
                <FlatList
                    data={surveyCategory}
                    renderItem={renderCategory}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                />
            </View>
        </Modal>
    );
};

export default CategoryListModal;
