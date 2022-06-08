import React, {useEffect, useCallback, useState} from 'react';
import {View, Image} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {RootStateOrAny, useSelector} from 'react-redux';

import Text from 'components/Text';
import {OptionIcon} from 'components/HeaderButton';
import SurveyActions from 'components/SurveyActions';
import SurveyReview from 'components/SurveyReview';

import useCategoryIcon from 'hooks/useCategoryIcon';
import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';
import {
    DELETE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
} from 'services/gql/queries';

import type {
    HappeningSurveyType,
    DeleteHappeningSurveyMutation,
    DeleteHappeningSurveyMutationVariables,
} from '@generated/types';

import styles from './styles';
import {getErrorMessage} from 'utils/error';

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

    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const [deleteHappeningSurvey] = useMutation<
        DeleteHappeningSurveyMutation,
        DeleteHappeningSurveyMutationVariables
    >(DELETE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show('Happening survey deleted sucessfully !');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log('Delete happening survey', err);
        },
    });

    const togggleOpenActions = useCallback(() => {
        setIsOpenActions(!isOpenActions);
        setIsOpenDelete(false);
    }, [isOpenActions]);

    const togggleEditPress = useCallback(() => {
        setIsOpenActions(false);
        navigation.navigate('EditSurvey', {surveyItem: surveyData});
    }, [navigation, surveyData]);

    const toggleDeleteModal = useCallback(() => {
        setIsOpenDelete(true);
    }, []);

    const toggleActionsModal = useCallback(() => {
        setIsOpenActions(false);
    }, []);

    const toggleConfirmDelete = useCallback(async () => {
        setIsOpenActions(false);
        await deleteHappeningSurvey({
            variables: {
                id: surveyData.id,
            },
            optimisticResponse: {
                deleteHappeningSurvey: {
                    __typename: 'DeleteHappeningSurvey',
                    ok: true,
                    errors: null,
                },
            },
            update: cache => {
                try {
                    const readData: any =
                        cache.readQuery({
                            query: GET_HAPPENING_SURVEY,
                        }) || [];
                    let happeningSurveys = readData?.happeningSurveys.filter(
                        (obj: HappeningSurveyType) => {
                            return obj.id !== surveyData.id;
                        },
                    );
                    cache.writeQuery({
                        query: GET_HAPPENING_SURVEY,
                        data: {
                            happeningSurveys: happeningSurveys,
                        },
                    });
                    navigation.navigate('Feed');
                } catch (e) {
                    console.log('Error on deleting happening survey !!!', e);
                }
            },
        });
    }, [deleteHappeningSurvey, navigation, surveyData?.id]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                surveyData.createdBy?.id === user?.id ? (
                    <OptionIcon onOptionPress={togggleOpenActions} />
                ) : null,
        });
    }, [navigation, togggleOpenActions, surveyData, user]);

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
            {surveyData?.sentiment.length > 0 && (
                <>
                    <Header title="Feels" />
                    <View style={styles.content}>
                        <View style={styles.feeelWrapper}>
                            <Text
                                style={styles.feelIcon}
                                title={surveyData?.sentiment}
                            />
                        </View>
                    </View>
                </>
            )}
            {surveyData?.improvement && (
                <>
                    <Header title="Improvement" />
                    <View style={styles.content}>
                        <SurveyReview
                            name={surveyData.improvement}
                            reviewItem={true}
                        />
                    </View>
                </>
            )}
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
