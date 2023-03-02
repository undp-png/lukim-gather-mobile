import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {Image, ScrollView, View, Platform, Switch} from 'react-native';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import {
    useFocusEffect,
    useNavigation,
    useRoute,
    type RouteProp,
} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image as ImageObj} from 'react-native-image-crop-picker';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';
import uuid from 'react-native-uuid';
import Geolocation from 'react-native-geolocation-service';
import {RNFetchBlobFile} from 'rn-fetch-blob';

import turfDistance from '@turf/distance';
import turfCentroid from '@turf/centroid';
import turfPoint from 'turf-point';
import turfPolygon from 'turf-polygon';

import AudioPicker from 'components/AudioPicker';
import Text from 'components/Text';
import InputField from 'components/InputField';
import ImagePicker from 'components/ImagePicker';
import {SaveButton} from 'components/HeaderButton';
import {ModalLoader} from 'components/Loader';
import CategoryListModal from 'components/CategoryListModal';
import ProjectInput from 'components/ProjectInput';
import SurveySentimentInput from 'components/SurveySentiment/input';
import SurveyReviewInput from 'components/SurveyReview/input';
import SurveyOptionInput, {
    projectVisibilityOptions,
    visibilityOptions,
    testSurveyOptions,
} from 'components/SurveyOptionInput';

import SurveyCategory from 'services/data/surveyCategory';
import {_} from 'services/i18n';
import {setLocation} from 'store/slices/survey';
import {checkLocation} from 'utils/location';
import useCategoryIcon from 'hooks/useCategoryIcon';
import {
    CREATE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
    GET_USER_PROJECTS,
} from 'services/gql/queries';
import useQuery from 'hooks/useQuery';
import {getErrorMessage} from 'utils/error';

import {
    HappeningSurveyType,
    HappeningSurveyInput,
    CreateHappeningSurveyMutation,
    CreateHappeningSurveyMutationVariables,
    SurveyHappeningSurveyImprovementChoices,
    ProjectType,
    ProtectedAreaCategoryType,
    InputMaybe,
    Improvement,
} from '@generated/types';
import type {StackParamList} from 'navigation';

import COLORS from 'utils/colors';
import {CLOSENESS_DISTANCE_THRESHOLD} from 'utils/config';

import styles from './styles';

const responseToRNF = (res: ImageObj) => {
    const image = {
        name: uuid.v4(),
        type: res.mime,
        uri: Platform.OS === 'ios' ? res.path.replace('file://', '') : res.path,
    };
    return new ReactNativeFile(image);
};

type CreateSurveyRouteProp = RouteProp<StackParamList, 'CreateSurvey'>;

const CreateHappeningSurvey = () => {
    const route = useRoute<CreateSurveyRouteProp>();
    const navigation = useNavigation<any>();

    const dispatch = useDispatch();

    const {data} = useQuery<{happeningSurveys: HappeningSurveyType[]}>(
        GET_HAPPENING_SURVEY,
    );
    const surveyData = useMemo(() => {
        return (data?.happeningSurveys || []) as HappeningSurveyType[];
    }, [data]);

    const {data: projectData, refetch: refetchProject} = useQuery<{
        me: {projects: ProjectType[]};
    }>(GET_USER_PROJECTS);
    useFocusEffect(
        useCallback(() => {
            refetchProject();
        }, [refetchProject]),
    );
    const projects = useMemo(() => {
        return (projectData?.me?.projects || []) as ProjectType[];
    }, [projectData]);

    const {location} = useSelector((state: RootStateOrAny) => state.survey);
    const {user, isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [activeFeel, setActiveFeel] = useState<string>('');
    const [activeReview, setActiveReview] =
        useState<SurveyHappeningSurveyImprovementChoices | null>(null);
    const [images, setImages] = useState<ImageObj[]>([]);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<ProtectedAreaCategoryType>(
        route.params.categoryItem,
    );
    const [project, setProject] = useState<ProjectType | null>(null);
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

    const [isPublic, setPublic] = useState<boolean>(true);
    const [isTest, setTest] = useState<boolean>(false);
    const [audio, setAudio] = useState<RNFetchBlobFile | null>(null);

    const [locationDetail, setLocationDetail] = useState<string>('');

    const [categoryIcon] = useCategoryIcon(SurveyCategory, Number(category.id));

    const [createHappeningSurvey, {loading}] = useMutation<
        CreateHappeningSurveyMutation,
        CreateHappeningSurveyMutationVariables
    >(CREATE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show('Survey Created Successfully !');
            navigation.navigate('Feed', {screen: 'Home'});
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
        if (!isAuthenticated) {
            return Toast.show(
                _(
                    'You do not have permission to perform this action. Please login.',
                ),
                Toast.LONG,
                ['RCTModalHostViewController'],
            );
        }
        setProcessing(true);
        let surveyInput: HappeningSurveyInput = {
            id: uuid.v4(),
            title: title,
            description: description,
            sentiment: activeFeel,
            improvement: activeReview as InputMaybe<Improvement>,
            attachment: images.map(responseToRNF),
            audioFile: audio,
            location: location.point
                ? {type: 'Point', coordinates: location?.point}
                : null,
            boundary: location.polygon
                ? {
                      type: 'MultiPolygon',
                      coordinates: [[location?.polygon]],
                  }
                : null,
            isPublic,
            isTest,
            categoryId: Number(category.id),
            createdAt: new Date().toISOString(),
        };
        if (project) {
            surveyInput.projectId = Number(project.id);
        }

        await createHappeningSurvey({
            variables: {
                input: surveyInput,
                anonymous: isAnonymous,
            },
            optimisticResponse: {
                createHappeningSurvey: {
                    __typename: 'CreateHappeningSurvey',
                    errors: [],
                    ok: null,
                    result: {
                        category: {
                            ...category,
                            __typename: 'ProtectedAreaCategoryType',
                        },
                        ...surveyInput,
                        project: project
                            ? {
                                  id: project.id,
                                  title: project.title,
                              }
                            : null,
                        id: surveyInput.id,
                        improvement:
                            surveyInput.improvement as HappeningSurveyType['improvement'],
                        isTest: surveyInput.isTest as HappeningSurveyType['isTest'],
                        isPublic:
                            surveyInput.isPublic as HappeningSurveyType['isPublic'],
                        attachment: surveyInput.attachment
                            ? [
                                  ...surveyInput.attachment.map(file => ({
                                      media: file.uri,
                                      id: file.name,
                                  })),
                              ]
                            : [],
                        audioFile:
                            surveyInput.audioFile as HappeningSurveyType['audioFile'],
                        createdBy: {
                            id: user?.id || '',
                            __typename: 'UserType',
                        },
                        createdAt: surveyInput.createdAt,
                        modifiedAt: surveyInput.createdAt,
                        isOffline: true,
                    },
                },
            },
            update: (cache, {data: cacheData}) => {
                try {
                    const readData: any = cache.readQuery({
                        query: GET_HAPPENING_SURVEY,
                    }) || {happeningSurveys: []};
                    let mergedSurveys = [];

                    const addedSurvey = cacheData?.createHappeningSurvey
                        ? {
                              ...cacheData.createHappeningSurvey.result,
                          }
                        : {};
                    if (readData.happeningSurveys?.length <= 0) {
                        mergedSurveys = [addedSurvey];
                    } else {
                        mergedSurveys = [
                            addedSurvey,
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
    }, [
        project,
        images,
        audio,
        title,
        description,
        category,
        createHappeningSurvey,
        activeFeel,
        activeReview,
        location,
        isAnonymous,
        navigation,
        user?.id,
        isPublic,
        isTest,
        isAuthenticated,
    ]);

    const handleImages = useCallback(
        async response => {
            if (response?.path) {
                response = [response];
            }
            setImages([...response, ...images]);
        },
        [images],
    );

    const handleAudio = useCallback(file => {
        setAudio(file);
    }, []);

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation');
    }, [navigation]);

    const handleConfirmToggle = useCallback(() => {
        if (!title) {
            return Toast.show(_('Please enter a title for the survey'));
        }
        handlePublish();
    }, [title, handlePublish]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleConfirmToggle} />,
        });
    }, [navigation, handleConfirmToggle]);

    const toggleOpenCategory = useCallback(
        () => setOpenCategory(!openCategory),
        [openCategory],
    );

    const toggleAnonymousValue = useCallback(() => {
        if (!isAnonymous) {
            setPublic(true);
        }
        setIsAnonymous(prev => !prev);
    }, [isAnonymous]);

    const closeEntries = useMemo(() => {
        if (
            (location?.point || location?.polygon?.[0]) &&
            surveyData.length > 0
        ) {
            return surveyData.filter(sd => {
                if (sd?.category && sd.category.title !== category?.title) {
                    return false;
                }
                if (sd.boundary?.coordinates?.[0]?.length > 4 || sd.location) {
                    let from = location.point
                        ? turfPoint(location.point)
                        : turfCentroid(turfPolygon([location.polygon]));
                    let to = sd.location
                        ? turfPoint(sd.location.coordinates)
                        : turfCentroid(
                              turfPolygon(sd?.boundary?.coordinates?.[0]),
                          );
                    if (from && to) {
                        const distance = turfDistance(from, to);
                        if (distance <= CLOSENESS_DISTANCE_THRESHOLD) {
                            return true;
                        }
                    }
                    return false;
                }
                return false;
            });
        }
        return [];
    }, [location, surveyData, category]);

    const handleExistingEntriesPress = useCallback(() => {
        navigation.navigate('ExistingEntries', {existingSurveys: closeEntries});
    }, [navigation, closeEntries]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            {closeEntries.length > 0 && (
                <>
                    <View style={styles.existingContainer}>
                        <Icon
                            style={styles.infoIcon}
                            name="alert-circle-outline"
                            width={22}
                            height={24}
                            fill={COLORS.grey200}
                        />
                        <Text
                            style={styles.existingText}
                            title={`There is already ${
                                closeEntries.length
                            } existing ${
                                closeEntries.length === 1 ? 'entry' : 'entries'
                            } with same category and location. Check ${
                                closeEntries.length === 1
                                    ? 'the entry'
                                    : 'those entries'
                            } to prevent duplication.`}
                        />
                        <View style={styles.goIconContainer}>
                            <TouchableOpacity
                                style={styles.goIconTouchable}
                                onPress={handleExistingEntriesPress}>
                                <Icon
                                    style={styles.goIcon}
                                    name="chevron-right-outline"
                                    width={12}
                                    height={12}
                                    fill={COLORS.blueTextAlt}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.header}>
                        <Text
                            style={styles.headerText}
                            title={_('CREATE A NEW ENTRY')}
                        />
                    </View>
                </>
            )}
            <View style={styles.categoryCont}>
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image source={categoryIcon} style={styles.categoryIcon} />
                    <Text style={styles.field} title={_(category.title)} />
                </View>
                <TouchableOpacity onPress={toggleOpenCategory}>
                    <Text style={styles.change} title={_('Change')} />
                </TouchableOpacity>
            </View>
            {projects.length > 0 && (
                <ProjectInput
                    style={styles.projectInput}
                    projects={projects}
                    activeProject={project}
                    onChange={setProject}
                />
            )}
            <InputField
                title={_('Name')}
                titleDark
                onChangeText={setTitle}
                value={title}
                placeholder={_('Enter survey name')}
            />
            <Text style={styles.title} title={_('Add Images')} />
            <ImagePicker
                onAddImage={handleImages}
                onRemoveImage={setImages}
                images={images}
                multiple
            />
            <Text style={styles.title} title={_('Location')} />
            <View style={styles.locationCont}>
                <View style={styles.locationWrapper}>
                    <Icon name="pin" height={20} width={20} fill={'#80A8C5'} />
                    <Text style={styles.countyName} title={locationDetail} />
                </View>
                <TouchableOpacity onPress={handleChangeLocation}>
                    <Text style={styles.change} title={_('Change')} />
                </TouchableOpacity>
            </View>
            <Text
                style={styles.title}
                title={_('How do you feel about this feature?')}
            />
            <SurveySentimentInput
                activeFeel={activeFeel}
                onChange={setActiveFeel}
                style={styles.feelings}
            />
            <Text
                style={styles.title}
                title={_(
                    'Is the condition of this feature improving, staying the same, or decreasing?',
                )}
            />
            <SurveyReviewInput
                activeReview={activeReview}
                onChange={setActiveReview}
                style={styles.feelings}
            />
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
            <View style={styles.anonymousInput}>
                <Text
                    style={styles.titleText}
                    title={_('I want to publish anonymously')}
                />
                <Switch
                    trackColor={{
                        true: COLORS.accent,
                        false: '#B7BABF',
                    }}
                    thumbColor={isAnonymous ? COLORS.white : '#EAEAEA'}
                    onValueChange={toggleAnonymousValue}
                    value={isAnonymous}
                />
            </View>
            {!isAnonymous && (
                <>
                    <Text
                        style={styles.title}
                        title={_('Who can see this survey?')}
                    />
                    <SurveyOptionInput
                        options={
                            project
                                ? projectVisibilityOptions
                                : visibilityOptions
                        }
                        style={styles.feelings}
                        value={isPublic}
                        onChange={setPublic}
                    />
                </>
            )}
            <Text
                style={styles.title}
                title={_('Is this real data or a test point?')}
            />
            <SurveyOptionInput
                options={testSurveyOptions}
                style={styles.feelings}
                value={isTest}
                onChange={setTest}
            />
            {isTest && (
                <Text
                    style={styles.message}
                    title={_(
                        'Please note that test data will be deleted periodically by administrator.',
                    )}
                />
            )}
            <Text style={styles.title} title={_('Add audio description')} />
            <AudioPicker
                onAddAudio={handleAudio}
                onRemoveAudio={setAudio}
                audio={audio}
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
