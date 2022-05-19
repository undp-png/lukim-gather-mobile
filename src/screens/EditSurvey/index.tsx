import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Image, ScrollView, View, Platform} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image as ImageObj} from 'react-native-image-crop-picker';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';

import Text from 'components/Text';
import InputField from 'components/InputField';
import ImagePicker from 'components/ImagePicker';
import {SaveButton} from 'components/HeaderButton';
import {ModalLoader} from 'components/Loader';
import CategoryListModal from 'components/CategoryListModal';
import SurveySentiment from 'components/SurveySentiment';
import SurveyReview from 'components/SurveyReview';

import SurveyCategory from 'services/data/surveyCategory';
import {_} from 'services/i18n';
import useCategoryIcon from 'hooks/useCategoryIcon';

import {
    UPDATE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
    UPLOAD_IMAGE,
} from 'services/gql/queries';

import {getErrorMessage} from 'utils/error';

import {
    HappeningSurveyType,
    UploadMediaMutation,
    UploadMediaMutationVariables,
    UpdateHappeningSurveyMutation,
    UpdateHappeningSurveyMutationVariables,
} from '@generated/types';

import styles from './styles';

const EditHappeningSurvey = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const {location} = useSelector((state: RootStateOrAny) => state.survey);
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [title, setTitle] = useState<string>(
        route.params?.categoryItem?.title,
    );
    const [activeFeel, setActiveFeel] = useState<string>(
        route.params?.categoryItem?.sentiment,
    );
    const [activeReview, setActiveReview] = useState<string | null>(
        route.params?.categoryItem?.improvement,
    );
    const [images, setImages] = useState<ImageObj[]>(
        route?.params?.categoryItem.attachment,
    );
    const [description, setDescription] = useState<string>(
        route.params?.categoryItem.description || '',
    );
    const [categoryItem, setCategoryItem] = useState<{
        id: number;
        name: string;
    }>({
        id: route.params?.categoryItem?.category.id,
        name: route.params?.categoryItem?.category.title,
    });
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(categoryItem.id),
    );
    const [attachment, setAttachment] = useState<any>([]);
    const [confirmPublish, setConfirmPublish] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<{
        polygon: string;
        point: string;
    } | null>(null);
    const [locationDetail, setLocationDetail] = useState<string>(
        route.params?.categoryItem?.location?.coordinates,
    );

    const handleFeel = useCallback(feel => {
        setActiveFeel(feel);
    }, []);

    const handleReview = useCallback(review => {
        setActiveReview(review);
    }, []);

    const [updateHappeningSurvey, {loading}] = useMutation<
        UpdateHappeningSurveyMutation,
        UpdateHappeningSurveyMutationVariables
    >(UPDATE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show('Survey updated Sucessfully !');
            navigation.navigate('Feed');
            setProcessing(loading);
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            setProcessing(loading);
            console.log(err);
        },
    });

    const handlePublish = useCallback(async () => {
        setProcessing(true);
        let surveyInput = {
            categoryId: +categoryItem?.id,
            title: title,
            description: description,
            sentiment: activeFeel,
            improvement: activeReview,
            attachment: attachment,
            location: location.point
                ? {type: 'Point', coordinates: location?.point}
                : null,
            boundary: location.polygon
                ? {
                      type: 'MultiPolygon',
                      coordinates: [[location?.polygon]],
                  }
                : null,
        };

        await updateHappeningSurvey({
            variables: {
                input: {...surveyInput},
                id: route.params?.categoryItem.id,
            },
            optimisticResponse: {
                updateHappeningSurvey: {
                    __typename: 'UpdateHappeningSurvey',
                    errors: [],
                    ok: null,
                    result: {
                        id: route.params?.categoryItem.id,
                        category: {
                            id: categoryItem.id,
                            title: categoryItem?.name,
                            __typename: 'ProtectedAreaCategoryType',
                        },
                        ...surveyInput,
                        createdBy: {
                            id: user?.id || '',
                            __typename: 'UserType',
                        },
                    },
                },
            },
            update: (cache, {data}) => {
                try {
                    const readData: any =
                        cache.readQuery({
                            query: GET_HAPPENING_SURVEY,
                        }) || [];
                    let updatedHappeningSurvey = readData.happeningSurveys.map(
                        (obj: HappeningSurveyType) => {
                            if (
                                data.updateHappeningSurvey.result.id === obj.id
                            ) {
                                return {
                                    __typename: obj.__typename,
                                    ...data.updateHappeningSurvey.result,
                                    createdBy: obj.createdBy,
                                };
                            }
                            return obj;
                        },
                    );

                    cache.writeQuery({
                        query: GET_HAPPENING_SURVEY,
                        data: {
                            happeningSurveys: updatedHappeningSurvey,
                        },
                    });
                    navigation.navigate('Feed');
                } catch (e) {
                    console.log('error on happening survey', e);
                }
            },
        });
        setProcessing(false);
        setConfirmPublish(!confirmPublish);
    }, [
        categoryItem,
        title,
        description,
        activeFeel,
        activeReview,
        attachment,
        updateHappeningSurvey,
        confirmPublish,
        location,
        route.params?.categoryItem.id,
        navigation,
        user?.id,
    ]);

    const handleImages = useCallback(
        async response => {
            if (response?.path) {
                response = [response];
            }
            setImages([...response, ...images]);
            response.forEach(async (res: ImageObj) => {
                const image = {
                    name: res.path.substring(res.path.lastIndexOf('/') + 1),
                    type: res.mime,
                    uri:
                        Platform.OS === 'ios'
                            ? res.path.replace('file://', '')
                            : res.path,
                };
                const media = new ReactNativeFile({
                    uri: image.uri,
                    name: image.name,
                    type: image.type,
                });
                setAttachment([media, ...attachment]);
            });
        },
        [images, attachment],
    );

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation');
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handlePublish} />,
        });
    }, [handlePublish, navigation]);

    const toggleOpenCategory = useCallback(
        () => setOpenCategory(!openCategory),
        [openCategory],
    );

    useEffect(() => {
        setCoordinates(location);
        if (coordinates && coordinates.polygon) {
            setLocationDetail('Boundaries');
        } else if (coordinates && coordinates.point) {
            setLocationDetail(`${coordinates?.point}`);
        } else if (route.params?.categoryItem?.location?.coordinates) {
            setLocationDetail(route.params.categoryItem.location.coordinates);
        } else {
            setLocationDetail('Choose the location');
        }
    }, [
        location,
        coordinates,
        route.params?.categoryItem?.location?.coordinates,
    ]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image source={categoryIcon} style={styles.categoryIcon} />
                    <Text style={styles.field} title={categoryItem?.name} />
                </View>
                <TouchableOpacity onPress={toggleOpenCategory}>
                    <Text style={styles.change} title="Change" />
                </TouchableOpacity>
            </View>
            <InputField
                title="Name"
                titleDark
                onChangeText={setTitle}
                value={title}
                placeholder="Enter survey name"
            />
            <Text style={styles.title} title="Add Images" />
            <ImagePicker
                onChange={handleImages}
                onRemoveImage={setImages}
                images={images}
                multiple
            />
            <Text style={styles.title} title="Location" />
            <View style={styles.locationCont}>
                <View style={styles.locationWrapper}>
                    <Icon name="pin" height={20} width={20} fill={'#80A8C5'} />
                    <Text style={styles.countyName} title={locationDetail} />
                </View>
                <TouchableOpacity onPress={handleChangeLocation}>
                    <Text style={styles.change} title="Change" />
                </TouchableOpacity>
            </View>
            <Text
                style={styles.title}
                title="How do you feel about this feature?"
            />
            <View style={styles.feelings}>
                <SurveySentiment
                    feel="🙁"
                    activeFeel={activeFeel}
                    onPress={handleFeel}
                />
                <SurveySentiment
                    feel="🙂"
                    activeFeel={activeFeel}
                    onPress={handleFeel}
                />
                <SurveySentiment
                    feel="😐"
                    activeFeel={activeFeel}
                    onPress={handleFeel}
                />
            </View>
            <Text
                style={styles.title}
                title="Is the condition of this feature improving, staying the same, or decreasing?"
            />
            <View style={styles.feelings}>
                <SurveyReview
                    name="INCREASING"
                    activeReview={activeReview}
                    onPress={handleReview}
                />
                <SurveyReview
                    name="SAME"
                    activeReview={activeReview}
                    onPress={handleReview}
                />
                <SurveyReview
                    name="DECREASING"
                    activeReview={activeReview}
                    onPress={handleReview}
                />
            </View>
            <InputField
                title="Description"
                titleDark
                multiline
                textAlignVertical="top"
                inputStyle={styles.textarea}
                onChangeText={setDescription}
                value={description}
                placeholder="What’s happening here?"
            />
            <CategoryListModal
                setCategory={setCategoryItem}
                setOpenCategory={setOpenCategory}
                onToggleModal={toggleOpenCategory}
                isOpen={openCategory}
            />
        </ScrollView>
    );
};

export default EditHappeningSurvey;
