import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {Image, ScrollView, View, Platform} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image as ImageObj} from 'react-native-image-crop-picker';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';
import uuid from 'react-native-uuid';

import Text from 'components/Text';
import InputField from 'components/InputField';
import ImagePicker from 'components/ImagePicker';
import {SaveButton} from 'components/HeaderButton';
import {ModalLoader} from 'components/Loader';
import CategoryListModal from 'components/CategoryListModal';
import SurveySentiment from 'components/SurveySentiment';
import SurveyReview from 'components/SurveyReview';

import SurveyCategory from 'services/data/surveyCategory';
import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import useCategoryIcon from 'hooks/useCategoryIcon';
import {OptionItem} from 'screens/CreateSurvey';

import {
    UPDATE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
} from 'services/gql/queries';

import {getErrorMessage} from 'utils/error';
import {
    HappeningSurveyType,
    UpdateHappeningSurveyMutation,
    UpdateHappeningSurveyMutationVariables,
    Improvement,
} from '@generated/types';

import styles from './styles';

const responseToRNF = res => {
    const image = {
        name: res.name,
        type: res.mime,
        uri: Platform.OS === 'ios' ? res.path.replace('file://', '') : res.path,
    };
    return new ReactNativeFile(image);
};
const EditHappeningSurvey = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [title, setTitle] = useState<string>(route.params?.surveyItem?.title);
    const [activeFeel, setActiveFeel] = useState<string>(
        route.params?.surveyItem?.sentiment,
    );
    const [activeReview, setActiveReview] = useState<Improvement | undefined>(
        route.params?.surveyItem?.improvement,
    );
    const [imageLinks, setImageLinks] = useState<ImageObj[]>(
        route?.params?.surveyItem.attachment,
    );
    const [description, setDescription] = useState<string>(
        route.params?.surveyItem.description || '',
    );
    const [surveyCategory, setSurveyCategory] = useState<{
        id: string;
        title: string;
    }>({
        id: route.params?.surveyItem?.category.id,
        title: route.params?.surveyItem?.category.title,
    });
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(surveyCategory.id),
    );
    const [attachment, setAttachment] = useState<any>([]);
    const [confirmPublish, setConfirmPublish] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<{
        polygon: number[];
        point: number[];
    } | null>(null);
    const [locationDetail, setLocationDetail] = useState<string>(
        route.params?.surveyItem?.location?.coordinates,
    );
    const [isPublic, setIsPublic] = useState<boolean>(
        route.params?.surveyItem?.isPublic,
    );
    const [isTest, setIsTest] = useState<boolean>(
        route.params?.surveyItem?.isTest,
    );

    const allImages = useMemo(() => {
        if (imageLinks?.length > -1) {
            if (attachment?.length > -1) {
                return [...attachment, ...imageLinks];
            }
            return imageLinks;
        }
        return [];
    }, [imageLinks, attachment]);

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
            Toast.show('Survey updated Successfully !');
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
        let surveyInput = {
            title: title,
            description: description,
            sentiment: activeFeel,
            improvement: activeReview,
            isTest: isTest,
            isPublic: isPublic,
            attachment: attachment.map(responseToRNF),
            attachmentLink: imageLinks.map(img => img.id),
        };

        if (coordinates) {
            surveyInput.location = coordinates.point
                ? {
                      __typename: 'GeometryObjectType',
                      type: 'Point',
                      coordinates: coordinates.point,
                  }
                : null;
            surveyInput.boundary = coordinates.polygon
                ? {
                      __typename: 'GeometryObjectType',
                      type: 'MultiPolygon',
                      coordinates: [[coordinates.polygon]],
                  }
                : null;
        } else {
            surveyInput.location = route.params?.surveyItem?.location
                ? route.params.surveyItem.location
                : null;
            surveyInput.boundary = route.params?.surveyItem?.boundary
                ? route.params.surveyItem.boundary
                : null;
        }

        setProcessing(true);
        await updateHappeningSurvey({
            variables: {
                input: {...surveyInput, categoryId: Number(surveyCategory.id)},
                id: route.params?.surveyItem.id,
            },
            optimisticResponse: {
                updateHappeningSurvey: {
                    __typename: 'UpdateHappeningSurvey',
                    errors: [],
                    ok: null,
                    result: {
                        ...surveyInput,
                        createdBy: {
                            id: user?.id || '',
                            __typename: 'UserType',
                        },
                        id: route.params?.surveyItem.id,
                        attachment: allImages.map((img, i) => {
                            if (img?.name) {
                                return {
                                    media: img.path || img.uri,
                                    id: img.name || i,
                                };
                            }
                            return img;
                        }),
                        category: {
                            __typename: 'ProtectedAreaCategoryType',
                            ...surveyCategory,
                        },
                        createdAt: new Date().toISOString(),
                        isOffline: true,
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
                                data?.updateHappeningSurvey?.result?.id ===
                                obj.id
                            ) {
                                return {
                                    ...obj,
                                    ...data?.updateHappeningSurvey?.result,
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
        coordinates,
        surveyCategory,
        title,
        description,
        activeFeel,
        activeReview,
        isPublic,
        isTest,
        attachment,
        updateHappeningSurvey,
        confirmPublish,
        route.params?.surveyItem.id,
        route.params?.surveyItem.location,
        route.params?.surveyItem.boundary,
        navigation,
        user?.id,
        allImages,
        imageLinks,
    ]);

    const handleAddImages = useCallback(
        async response => {
            if (response?.path) {
                response = [response];
            }
            response.forEach(res => (res.name = uuid.v4()));
            setAttachment([...response, ...attachment]);
        },
        [attachment],
    );

    const handleRemoveImages = useCallback(newImages => {
        if (newImages?.length) {
            const {newImgs, newAttachment} = newImages.reduce(
                (acc, currentImage) => {
                    if (currentImage?.name) {
                        acc.newAttachment.push(currentImage);
                    } else {
                        acc.newImgs.push(currentImage);
                    }
                    return acc;
                },
                {newImgs: [], newAttachment: []},
            );
            setImageLinks(newImgs);
            return setAttachment(newAttachment);
        }
        setImageLinks([]);
        setAttachment([]);
    }, []);

    const handleCoordinatesChange = useCallback(
        (coords: {polygon: number[]; point: number[]}) => {
            setCoordinates(coords);
        },
        [],
    );

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation', {
            surveyData: route.params?.surveyItem,
            onChange: handleCoordinatesChange,
        });
    }, [navigation, route, handleCoordinatesChange]);

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
        if (coordinates && coordinates.polygon) {
            setLocationDetail('Boundaries');
        } else if (coordinates && coordinates.point) {
            setLocationDetail(`${coordinates.point.join(', ')}`);
        } else if (route.params?.surveyItem?.location?.coordinates) {
            setLocationDetail(
                route.params.surveyItem.location.coordinates.join(', '),
            );
        } else if (route.params?.surveyItem?.boundary?.coordinates) {
            setLocationDetail('Boundaries');
        } else {
            setLocationDetail('Choose the location');
        }
    }, [coordinates, route.params?.surveyItem]);

    const handlePublicPress = useCallback(() => setIsPublic(true), []);
    const handleNotPublicPress = useCallback(() => setIsPublic(false), []);

    const handleTestPress = useCallback(() => setIsTest(true), []);
    const handleNotTestPress = useCallback(() => setIsTest(false), []);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image source={categoryIcon} style={styles.categoryIcon} />
                    <Text
                        style={styles.field}
                        title={_(surveyCategory?.title)}
                    />
                </View>
                <TouchableOpacity onPress={toggleOpenCategory}>
                    <Text style={styles.change} title={_('Change')} />
                </TouchableOpacity>
            </View>
            <InputField
                title={_('Name')}
                titleDark
                onChangeText={setTitle}
                value={title}
                placeholder={_('Enter survey name')}
            />
            <Text style={styles.title} title={_('Add Images')} />
            <ImagePicker
                onAddImage={handleAddImages}
                onRemoveImage={handleRemoveImages}
                images={allImages}
                multiple
            />
            <Text style={styles.title} title={_('Location')} />
            <View style={styles.locationCont}>
                <View style={styles.locationWrapper}>
                    <Icon name="pin" height={20} width={20} fill={'#80A8C5'} />
                    <Text
                        style={styles.countyName}
                        title={
                            locationDetail
                                ? locationDetail
                                : route.params?.surveyItem?.boundary
                                      ?.coordinates
                                ? 'Boundaries'
                                : ''
                        }
                    />
                </View>
                <TouchableOpacity onPress={handleChangeLocation}>
                    <Text style={styles.change} title={_('Change')} />
                </TouchableOpacity>
            </View>
            <Text
                style={styles.title}
                title={_('How do you feel about this feature?')}
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
                title={_(
                    'Is the condition of this feature improving, staying the same, or decreasing?',
                )}
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
                title={_('Description')}
                titleDark
                multiline
                textAlignVertical="top"
                inputStyle={styles.textarea}
                onChangeText={setDescription}
                value={description}
                placeholder={_('What’s happening here?')}
            />
            <Text style={styles.title} title={_('Who can see this survey?')} />
            <View style={styles.feelings}>
                <OptionItem
                    text={_('Only me')}
                    iconName="lock-outline"
                    isActive={!isPublic}
                    onPress={handleNotPublicPress}
                />
                <OptionItem
                    text={_('Everyone')}
                    isActive={isPublic}
                    iconName="people-outline"
                    style={styles.spaceLeft}
                    onPress={handlePublicPress}
                />
            </View>
            <Text
                style={styles.title}
                title={_('Is this real data or a test point?')}
            />
            <View style={cs(styles.feelings, styles.isTest)}>
                <OptionItem
                    isActive={!isTest}
                    text={_('Real data')}
                    iconName="checkmark-circle-outline"
                    onPress={handleNotTestPress}
                />
                <OptionItem
                    isActive={isTest}
                    text={_('Test data')}
                    iconName="funnel-outline"
                    style={styles.spaceLeft}
                    onPress={handleTestPress}
                />
            </View>
            <CategoryListModal
                setCategory={setSurveyCategory}
                setOpenCategory={setOpenCategory}
                onToggleModal={toggleOpenCategory}
                isOpen={openCategory}
            />
        </ScrollView>
    );
};

export default EditHappeningSurvey;
