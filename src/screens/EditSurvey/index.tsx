import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {Image, ScrollView, View, Platform} from 'react-native';
import {
    useNavigation,
    useRoute,
    type RouteProp,
} from '@react-navigation/native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import Toast from 'react-native-simple-toast';
import uuid from 'react-native-uuid';

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
import useCategoryIcon from 'hooks/useCategoryIcon';
import {getErrorMessage} from 'utils/error';
import useQuery from 'hooks/useQuery';

import {
    EDIT_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
    GET_USER_PROJECTS,
} from 'services/gql/queries';

import type {StackParamList} from 'navigation';
import type {
    InputMaybe,
    Improvement,
    ProtectedAreaCategoryType,
    HappeningSurveyType,
    UpdateHappeningSurveyInput,
    EditHappeningSurveyMutation,
    EditHappeningSurveyMutationVariables,
    Scalars,
    ProjectType,
} from '@generated/types';

import styles from './styles';

const responseToRNF = (res: Scalars['Upload']) => {
    const image = {
        name: uuid.v4() + '.' + (res.path.split('.')?.pop() || ''),
        type: res.mime,
        uri: Platform.OS === 'ios' ? res.path.replace('file://', '') : res.path,
    };
    return new ReactNativeFile(image);
};

type EditSurveyRouteProp = RouteProp<StackParamList, 'EditSurvey'>;
const EditHappeningSurvey = () => {
    const {params} = useRoute<EditSurveyRouteProp>();

    const navigation = useNavigation<any>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const {data: projectData} = useQuery<{me: {projects: ProjectType[]}}>(
        GET_USER_PROJECTS,
    );
    const projects = useMemo(() => {
        return (projectData?.me?.projects || []) as ProjectType[];
    }, [projectData]);

    const surveyItem = useMemo(() => params.surveyItem, [params]);

    const [title, setTitle] = useState<HappeningSurveyType['title']>(
        surveyItem.title,
    );
    const [activeFeel, setActiveFeel] = useState<
        HappeningSurveyType['sentiment']
    >(surveyItem.sentiment);
    const [activeReview, setActiveReview] = useState<
        HappeningSurveyType['improvement']
    >(surveyItem.improvement);
    const [imageLinks, setImageLinks] = useState<
        HappeningSurveyType['attachment']
    >(surveyItem.attachment);

    const [description, setDescription] = useState<string>(
        surveyItem.description || '',
    );
    const [surveyCategory, setSurveyCategory] =
        useState<ProtectedAreaCategoryType>(
            surveyItem.category as ProtectedAreaCategoryType,
        );
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(surveyCategory.id),
    );
    const [attachment, setAttachment] = useState<Scalars['Upload'][]>([]);
    const [confirmPublish, setConfirmPublish] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<{
        polygon: number[];
        point: number[];
    } | null>(null);
    const [locationDetail, setLocationDetail] = useState<string>(
        surveyItem.location?.coordinates,
    );
    const [isPublic, setIsPublic] = useState<boolean>(surveyItem.isPublic);
    const [isTest, setIsTest] = useState<boolean>(surveyItem.isTest);
    const [project, setProject] = useState<HappeningSurveyType['project']>(
        surveyItem.project,
    );
    const [audio, setAudio] = useState<HappeningSurveyType['audioFile']>(
        surveyItem.audioFile,
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

    const [editHappeningSurvey, {loading}] = useMutation<
        EditHappeningSurveyMutation,
        EditHappeningSurveyMutationVariables
    >(EDIT_HAPPENING_SURVEY, {
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
        let surveyInput: UpdateHappeningSurveyInput = {
            title: title,
            description: description,
            sentiment: activeFeel,
            improvement: activeReview as InputMaybe<Improvement>,
            isTest: isTest,
            isPublic: isPublic,
            attachment: attachment.map(responseToRNF),
            attachmentLink: imageLinks.map(img => img.id),
            modifiedAt: new Date().toISOString(),
        };
        if (typeof audio !== 'string') {
            surveyInput.audioFile = audio;
        }

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
            surveyInput.location = surveyItem.location || null;
            surveyInput.boundary = surveyItem.boundary || null;
        }

        if (project) {
            surveyInput.projectId = Number(project.id);
        } else {
            surveyInput.projectId = null;
        }

        try {
            setProcessing(true);
            await editHappeningSurvey({
                variables: {
                    input: {
                        ...surveyInput,
                        categoryId: Number(surveyCategory.id),
                    },
                    id: surveyItem.id,
                },
                optimisticResponse: {
                    editHappeningSurvey: {
                        __typename: 'EditHappeningSurvey',
                        errors: [],
                        ok: null,
                        result: {
                            ...surveyInput,
                            project: project
                                ? {id: project.id, title: project.title}
                                : null,
                            improvement:
                                surveyInput.improvement as HappeningSurveyType['improvement'],
                            isTest: surveyInput.isTest as HappeningSurveyType['isTest'],
                            isPublic:
                                surveyInput.isPublic as HappeningSurveyType['isPublic'],
                            createdBy: {
                                id: user?.id || '',
                                __typename: 'UserType',
                            },
                            id: surveyItem.id,
                            attachment: allImages.map((img, i) => {
                                if (img?.name) {
                                    return {
                                        media: img.path || img.uri,
                                        id: img.name || i,
                                    };
                                }
                                return img;
                            }),
                            audioFile:
                                typeof audio === 'string'
                                    ? audio
                                    : (surveyInput?.audioFile as HappeningSurveyType['audioFile']),
                            category: {
                                __typename: 'ProtectedAreaCategoryType',
                                ...surveyCategory,
                            },
                            createdAt: surveyItem.createdAt,
                            modifiedAt: surveyInput.modifiedAt,
                            isOffline: true,
                        },
                    },
                },
                update: async (cache, {data}) => {
                    try {
                        const readData: any =
                            cache.readQuery({
                                query: GET_HAPPENING_SURVEY,
                            }) || [];
                        let updatedHappeningSurvey =
                            readData.happeningSurveys.map(
                                (obj: HappeningSurveyType) => {
                                    if (
                                        data?.editHappeningSurvey?.result
                                            ?.id === obj.id
                                    ) {
                                        return {
                                            ...obj,
                                            ...data?.editHappeningSurvey
                                                ?.result,
                                        };
                                    }
                                    return obj;
                                },
                            );

                        await cache.writeQuery({
                            query: GET_HAPPENING_SURVEY,
                            data: {
                                happeningSurveys: updatedHappeningSurvey,
                            },
                        });
                        navigation.navigate('Feed', {screen: 'Home'});
                    } catch (e) {
                        console.log('error on happening survey', e);
                    }
                },
            });
        } catch (error) {
            console.log(error);
        }
        setProcessing(false);
        setConfirmPublish(!confirmPublish);
    }, [
        project,
        coordinates,
        surveyCategory,
        title,
        description,
        activeFeel,
        activeReview,
        isPublic,
        isTest,
        attachment,
        audio,
        editHappeningSurvey,
        confirmPublish,
        surveyItem,
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
            response.forEach((res: any) => (res.name = uuid.v4()));
            setAttachment([...response, ...attachment]);
        },
        [attachment],
    );

    const handleRemoveImages = useCallback(newImages => {
        if (newImages?.length) {
            const {newImgs, newAttachment} = newImages.reduce(
                (
                    acc: {newImgs: any[]; newAttachment: any[]},
                    currentImage: any,
                ) => {
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

    const handleAudio = useCallback(file => {
        setAudio(file);
    }, []);

    const handleCoordinatesChange = useCallback(
        (coords: {polygon: number[]; point: number[]}) => {
            setCoordinates(coords);
        },
        [],
    );

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation', {
            surveyData: surveyItem,
            onChange: handleCoordinatesChange,
        });
    }, [navigation, surveyItem, handleCoordinatesChange]);

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
        } else if (surveyItem.location?.coordinates) {
            setLocationDetail(surveyItem.location.coordinates.join(', '));
        } else if (surveyItem.boundary?.coordinates) {
            setLocationDetail('Boundaries');
        } else {
            setLocationDetail('Choose the location');
        }
    }, [coordinates, surveyItem]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image source={categoryIcon} style={styles.categoryIcon} />
                    <Text
                        style={styles.field}
                        title={_(surveyCategory.title)}
                    />
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
                    disabled={Boolean(surveyItem?.project)}
                />
            )}
            <InputField
                title={_('Name')}
                titleDark
                onChangeText={setTitle}
                value={title as string}
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
                                : surveyItem.boundary?.coordinates
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
            <SurveySentimentInput
                activeFeel={activeFeel as string}
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
            <Text style={styles.title} title={_('Who can see this survey?')} />
            <SurveyOptionInput
                options={project ? projectVisibilityOptions : visibilityOptions}
                style={styles.feelings}
                value={isPublic}
                onChange={setIsPublic}
            />
            <Text
                style={styles.title}
                title={_('Is this real data or a test point?')}
            />
            <SurveyOptionInput
                options={testSurveyOptions}
                style={styles.feelings}
                value={isTest}
                onChange={setIsTest}
            />
            <Text style={styles.title} title={_('Add audio description')} />
            <AudioPicker
                onAddAudio={handleAudio}
                onRemoveAudio={setAudio}
                audio={audio}
            />
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
