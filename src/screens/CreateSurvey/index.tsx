import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, View, Platform} from 'react-native';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image as ImageObj} from 'react-native-image-crop-picker';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';
import uuid from 'react-native-uuid';
import Geolocation from 'react-native-geolocation-service';

import Text from 'components/Text';
import InputField from 'components/InputField';
import ImagePicker from 'components/ImagePicker';
import {SaveButton} from 'components/HeaderButton';
import {SurveyConfirmBox} from 'components/SurveyConfirmationBox';
import {ModalLoader} from 'components/Loader';
import CategoryListModal from 'components/CategoryListModal';
import SurveySentiment from 'components/SurveySentiment';
import SurveyReview from 'components/SurveyReview';

import SurveyCategory from 'services/data/surveyCategory';
import {_} from 'services/i18n';
import {setLocation} from 'store/slices/survey';
import {checkLocation} from 'utils/location';
import useCategoryIcon from 'hooks/useCategoryIcon';

import {
    CreateHappeningSurveyMutation,
    CreateHappeningSurveyMutationVariables,
} from '@generated/types';

import {
    CREATE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

import styles from './styles';

const CreateHappeningSurvey = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const dispatch = useDispatch();

    const {location} = useSelector((state: RootStateOrAny) => state.survey);
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [activeFeel, setActiveFeel] = useState<string>('');
    const [activeReview, setActiveReview] = useState<string | undefined>(
        undefined,
    );
    const [images, setImages] = useState<ImageObj[]>([]);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<{
        id: number;
        name: string;
        icon: string;
    }>(route.params?.categoryItem);
    const [attachment, setAttachment] = useState<any>([]);
    const [confirmPublish, setConfirmPublish] = useState<boolean>(false);
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [locationDetail, setLocationDetail] = useState<string>('');

    const [categoryIcon] = useCategoryIcon(SurveyCategory, Number(category.id));

    const handleFeel = useCallback(feel => {
        setActiveFeel(feel);
    }, []);

    const handleReview = useCallback(review => {
        setActiveReview(review);
    }, []);

    const [createHappeningSurvey, {loading}] = useMutation<
        CreateHappeningSurveyMutation,
        CreateHappeningSurveyMutationVariables
    >(CREATE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show('Survey Created Sucessfully !');
            navigation.navigate('Feed');
            setProcessing(loading);
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            setProcessing(loading);
            console.log('happening survey', err);
        },
    });

    const initializeLocation = useCallback(() => {
        checkLocation().then(result => {
            if (result) {
                Geolocation.getCurrentPosition(position => {
                    dispatch(
                        setLocation({
                            point: [
                                position.coords.longitude,
                                position.coords.latitude,
                            ],
                        }),
                    );
                    setLocationDetail('Your location');
                });
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if (!locationDetail) {
            initializeLocation();
        } else {
            if (location && location.polygon) {
                setLocationDetail('Boundaries');
            } else if (location && location.point) {
                setLocationDetail('Your location');
            }
        }
    }, [location, locationDetail, initializeLocation]);

    const handlePublish = useCallback(async () => {
        setProcessing(true);
        let surveyInput = {
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

        await createHappeningSurvey({
            variables: {
                input: {...surveyInput, categoryId: category.id},
                anonymous: isAnonymous,
            },
            optimisticResponse: {
                createHappeningSurvey: {
                    __typename: 'CreateHappeningSurvey',
                    errors: [],
                    ok: null,
                    result: {
                        id: uuid.v4(),
                        category: {
                            id: category.id,
                            title: category.name,
                            __typename: 'ProtectedAreaCategoryType',
                        },
                        ...surveyInput,
                        attachment: [
                            ...surveyInput.attachment.map(file => ({
                                media: file.uri,
                            })),
                        ],
                        createdBy: {
                            id: user?.id || '',
                            __typename: 'UserType',
                        },
                        createdAt: new Date().toISOString(),
                    },
                },
            },
            update: (cache, {data}) => {
                try {
                    const readData: any =
                        cache.readQuery({
                            query: GET_HAPPENING_SURVEY,
                        }) || [];
                    let mergedSurveys = [];

                    if (readData.happeningSurveys.length <= 0) {
                        mergedSurveys = [data.createHappeningSurvey.result];
                    } else {
                        mergedSurveys = [
                            data.createHappeningSurvey.result,
                            ...readData.happeningSurveys,
                        ];
                    }

                    cache.writeQuery({
                        query: GET_HAPPENING_SURVEY,
                        data: {
                            ...readData,
                            happeningSurveys: mergedSurveys,
                        },
                    });
                    Toast.show(_('Survey has been recorded'), Toast.LONG, [
                        'RCTModalHostVIewController',
                    ]);
                    navigation.navigate('Feed');
                } catch (e) {
                    console.log('error on happening survey', e);
                }
            },
        });
        setProcessing(false);
        setConfirmPublish(!confirmPublish);
    }, [
        title,
        description,
        category,
        createHappeningSurvey,
        confirmPublish,
        activeFeel,
        activeReview,
        attachment,
        location,
        isAnonymous,
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
                const media = new ReactNativeFile(image);
                setAttachment([media, ...attachment]);
            });
        },
        [images, attachment],
    );

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation');
    }, [navigation]);

    const handleConfirmToggle = useCallback(() => {
        if (!title) {
            return Toast.show(_('Please enter a title for the survey'));
        }
        setConfirmPublish(!confirmPublish);
    }, [title, confirmPublish]);

    const handleCancel = useCallback(() => {
        setConfirmPublish(!confirmPublish);
    }, [confirmPublish]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleConfirmToggle} />,
        });
    }, [navigation, handleConfirmToggle]);

    const toggleOpenCategory = useCallback(
        () => setOpenCategory(!openCategory),
        [openCategory],
    );

    const updateAnonymousStatus = useCallback(
        anonymous => {
            setIsAnonymous(anonymous);
        },
        [setIsAnonymous],
    );

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <SurveyConfirmBox
                    updateAnonymousStatus={updateAnonymousStatus}
                    isOpen={confirmPublish}
                    onCancel={handleCancel}
                    onSubmit={handlePublish}
                />
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image source={categoryIcon} style={styles.categoryIcon} />
                    <Text style={styles.field} title={category.name} />
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
                setCategory={setCategory}
                setOpenCategory={setOpenCategory}
                onToggleModal={toggleOpenCategory}
                isOpen={openCategory}
            />
        </ScrollView>
    );
};

export default CreateHappeningSurvey;
