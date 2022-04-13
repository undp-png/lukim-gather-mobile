import React, {useCallback} from 'react';
import {View, Image, Pressable} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import Text from 'components/Text';

import {_} from 'services/i18n';

import surveyCategory from 'services/data/surveyCategory';

import styles from './styles';
import {Icon} from 'react-native-eva-icons';
import COLORS from 'utils/colors';

const keyExtractor = (item: {id: any}) => item.id;

interface CategoryProps {
    category: any;
    setCategory(item: {icon: string; name: string; id: number}): void;
    setOpenCategory(arg0: boolean): void;
}

const Category: React.FC<CategoryProps> = props => {
    const {category, setOpenCategory} = props;
    const renderSubCategory = useCallback(
        ({item}: {item: {icon: string; name: string; id: number}}) => (
            <TouchableOpacity
                onPress={() => {
                    props.setCategory(item);
                    setOpenCategory(false);
                }}
                style={styles.subCategory}>
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
        [props, setOpenCategory],
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
            animationInTiming={150}
            isVisible={isOpen}
            backdropOpacity={0.5}
            style={styles.modal}
            statusBarTranslucent={true}>
            <View style={styles.boxContent}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity
                        onPress={onToggleModal}
                        style={styles.closeWrapper}>
                        <Icon
                            name="close-circle-outline"
                            height={25}
                            width={25}
                            fill={COLORS.tertiary}
                        />
                    </TouchableOpacity>
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
