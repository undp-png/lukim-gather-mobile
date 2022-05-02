import React, {useEffect, useCallback, useState} from 'react';
import {View, Image} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';

import Text from 'components/Text';
import {OptionIcon} from 'components/HeaderButton';
import SurveyActions from 'components/SurveyActions';

import useCategoryIcon from 'hooks/useCategoryIcon';
import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';

import styles from './styles';

const Header = ({title}: {title: string}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle} title={title} />
        </View>
    );
};

const Photos = ({photos}: {photos: {media: string}[]}) => {
    const renderItem = useCallback(
        ({item}: {item: {media: string}}) => (
            <Image
                source={
                    {uri: item.media} ||
                    require('assets/images/category-placeholder.png')
                }
                style={styles.surveyImage}
            />
        ),
        [],
    );
    return (
        <FlatList
            data={photos}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const SurveyItem = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const [isOpenActions, setIsOpenActions] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const surveyData = route?.params?.item;
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(surveyData?.category?.id),
    );

    const togggleOpenActions = useCallback(() => {
        setIsOpenActions(!isOpenActions);
        setIsOpenDelete(false);
    }, [isOpenActions]);

    const togggleEditPress = useCallback(() => {
        setIsOpenActions(false);
        navigation.navigate('EditSurvey', {categoryItem: surveyData});
    }, [navigation, surveyData]);

    const toggleDeleteModal = useCallback(() => {
        setIsOpenDelete(true);
    }, []);

    const toggleActionsModal = useCallback(() => {
        setIsOpenActions(false);
    }, []);

    const toggleConfirmDelete = useCallback(() => {
        //todo delete
        setIsOpenActions(false);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <OptionIcon onOptionPress={togggleOpenActions} />
            ),
        });
    }, [navigation, togggleOpenActions]);
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.category}>
                <Image
                    source={
                        categoryIcon ||
                        require('assets/images/category-placeholder.png')
                    }
                    style={styles.categoryIcon}
                />
                <Text
                    style={styles.field}
                    title={surveyData?.category?.title}
                />
            </View>
            <Header title="Name" />
            <View style={styles.content}>
                <Text style={styles.name} title={surveyData?.title} />
            </View>
            <Header title="Photos" />
            <View style={styles.photosWrapper}>
                <Photos photos={surveyData?.attachment} />
            </View>
            <Header title="Feels" />
            <View style={styles.content}>
                <View style={styles.feeelWrapper}>
                    <Text
                        style={styles.feelIcon}
                        title={surveyData?.sentiment}
                    />
                </View>
            </View>
            <Header title="Description" />
            <View style={styles.content}>
                <Text
                    style={styles.description}
                    title={surveyData?.description}
                />
            </View>
            <SurveyActions
                isOpenActions={isOpenActions}
                onEditPress={togggleEditPress}
                onDeletePress={toggleDeleteModal}
                onBackdropPress={toggleActionsModal}
                isConfirmDeleteOpen={isOpenDelete}
                toggleCancelDelete={toggleActionsModal}
                toggleConfirmDelete={toggleConfirmDelete}
            />
        </ScrollView>
    );
};

export default SurveyItem;
