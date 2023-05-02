import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {View, ScrollView, Image, Platform} from 'react-native';
import {
    useRoute,
    useNavigation,
    CommonActions,
    type RouteProp,
} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {Icon} from 'react-native-eva-icons';
import {format} from 'date-fns';
import uuid from 'react-native-uuid';

import AudioPicker from 'components/AudioPicker';
import {SaveButton} from 'components/HeaderButton';
import InputField from 'components/InputField';
import ImagePicker from 'components/ImagePicker';
import {ModalLoader} from 'components/Loader';
import ProjectInput from 'components/ProjectInput';
import SurveySentimentInput from 'components/SurveySentiment/input';
import SurveyReviewInput, {
    SurveyReviewIcon,
} from 'components/SurveyReview/input';
import SurveyOptionInput, {
    projectVisibilityOptions,
    visibilityOptions,
    testSurveyOptions,
} from 'components/SurveyOptionInput';
import Text from 'components/Text';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import SurveyCategoryData from 'services/data/surveyCategory';
import COLORS from 'utils/colors';
import {getErrorMessage} from 'utils/error';
import Toast from 'utils/toast';
import {
    GET_HAPPENING_SURVEY,
    UPDATE_HAPPENING_SURVEY,
} from 'services/gql/queries';

import useCategoryIcon from 'hooks/useCategoryIcon';

import type {StackParamList} from 'navigation';
import type {
    Scalars,
    Maybe,
    InputMaybe,
    Improvement,
    HappeningSurveyType,
    ProtectedAreaCategoryType,
    SurveyHappeningSurveyImprovementChoices,
    UpdateHappeningSurveyMutation,
    UpdateHappeningSurveyMutationVariables,
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

type UpdateSurveyRouteProp = RouteProp<StackParamList, 'UpdateSurvey'>;
const UpdateSurvey = () => {
    const {params} = useRoute<UpdateSurveyRouteProp>();

    const navigation = useNavigation();

    const [surveyItem, surveyCategory] = useMemo(() => {
        return [
            params.surveyItem,
            params.surveyItem.category as ProtectedAreaCategoryType,
        ];
    }, [params]);
    const [categoryIcon] = useCategoryIcon(
        SurveyCategoryData,
        Number(surveyCategory.id),
    );
    const surveyLocation = useMemo(() => {
        if (surveyItem.location?.coordinates) {
            return String(surveyItem.location.coordinates);
        } else if (surveyItem.boundary) {
            return _('Boundaries');
        }
        return '';
    }, [surveyItem]);

    const initialSentiment = useMemo(() => surveyItem.sentiment, [surveyItem]);
    const [activeSentiment, setActiveSentiment] = useState<string>(
        initialSentiment as string,
    );

    const initialReview = useMemo(() => surveyItem.improvement, [surveyItem]);
    const [activeReview, setActiveReview] = useState<
        Maybe<SurveyHappeningSurveyImprovementChoices> | undefined
    >(initialReview);

    const [description, setDescription] = useState<string>(
        surveyItem.description || '',
    );

    const lastUpdated = useMemo(() => {
        return format(new Date(params.surveyItem.modifiedAt), 'MMM dd, yyyy');
    }, [params.surveyItem]);

    const [newImages, setNewImages] = useState<any[]>([]);
    const handleAddImages = useCallback(response => {
        if (response?.path) {
            response = [response];
        }
        response.forEach((res: any) => (res.name = uuid.v4()));
        setNewImages(ni => [...response, ...ni]);
    }, []);

    const [audio, setAudio] = useState<HappeningSurveyType['audioFile']>(
        surveyItem.audioFile,
    );
    const handleAudio = useCallback(file => {
        setAudio(file);
    }, []);

    const [processing, setProcessing] = useState<boolean>(false);
    const [updateHappeningSurvey, {loading}] = useMutation<
        UpdateHappeningSurveyMutation,
        UpdateHappeningSurveyMutationVariables
    >(UPDATE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show(_('Survey updated successfully!'));
            setProcessing(loading);
        },
        onError: err => {
            Toast.error(_('Could not update survey!'), getErrorMessage(err));
            setProcessing(loading);
            console.log(err);
        },
    });

    const handleUpdate = useCallback(async () => {
        const surveyInput = {
            sentiment: activeSentiment,
            improvement: activeReview as InputMaybe<Improvement>,
            attachment: newImages.map(responseToRNF),
            audioFile: audio,
            description,
            modifiedAt: new Date().toISOString(),
        };
        if (typeof audio !== 'string') {
            surveyInput.audioFile = audio;
        }
        setProcessing(true);
        await updateHappeningSurvey({
            variables: {input: surveyInput, id: surveyItem.id},
            optimisticResponse: {
                updateHappeningSurvey: {
                    __typename: 'UpdateHappeningSurvey',
                    errors: [],
                    ok: true,
                    result: {
                        ...surveyItem,
                        __typename: 'HappeningSurveyType',
                        category: {
                            __typename: 'ProtectedAreaCategoryType',
                            ...surveyCategory,
                        },
                        project: surveyItem.project ?? null,
                        boundary: surveyItem.boundary ?? null,
                        location: surveyItem.location ?? null,
                        ...surveyInput,
                        attachment: [
                            ...newImages.map(img => ({
                                media: img.path,
                                id: img.name,
                            })),
                            ...surveyItem.attachment,
                        ],
                        audioFile:
                            typeof audio === 'string'
                                ? audio
                                : (surveyInput?.audioFile as HappeningSurveyType['audioFile']),
                        improvement:
                            surveyInput.improvement as HappeningSurveyType['improvement'],
                        isOffline: true,
                    },
                },
            },
            update: async (cache, {data}) => {
                try {
                    const readData = (cache.readQuery({
                        query: GET_HAPPENING_SURVEY,
                    }) || []) as {happeningSurveys: HappeningSurveyType[]};
                    const updatedHappeningSurveys =
                        readData.happeningSurveys.map(hs => {
                            if (
                                data?.updateHappeningSurvey?.result &&
                                data?.updateHappeningSurvey?.result?.id ===
                                    hs.id
                            ) {
                                return {
                                    ...hs,
                                    ...data.updateHappeningSurvey.result,
                                };
                            }
                            return hs;
                        });
                    await cache.writeQuery({
                        query: GET_HAPPENING_SURVEY,
                        data: {
                            happeningSurveys: updatedHappeningSurveys,
                        },
                    });
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {name: 'Feed'},
                                {
                                    name: 'SurveyItem',
                                    params: {
                                        item: data?.updateHappeningSurvey
                                            ?.result as HappeningSurveyType,
                                    },
                                },
                            ],
                        }),
                    );
                } catch (err) {
                    console.log(err);
                }
            },
        });
        setProcessing(false);
    }, [
        activeSentiment,
        activeReview,
        newImages,
        audio,
        description,
        surveyItem,
        surveyCategory,
        updateHappeningSurvey,
        navigation,
    ]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleUpdate} />,
        });
    }, [handleUpdate, navigation]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <ModalLoader loading={processing} />
            <View style={styles.categoryContainer}>
                <Image source={categoryIcon} style={styles.categoryIcon} />
                <Text
                    style={styles.categoryText}
                    title={surveyCategory.title}
                />
            </View>
            {Boolean(params.surveyItem.project) && (
                <ProjectInput
                    style={styles.project}
                    activeProject={params.surveyItem.project}
                    disabled
                />
            )}
            <View style={styles.lastUpdate}>
                <Text style={styles.lastUpdateText} title="Last updated" />
                <Text style={styles.lastUpdateDate} title={lastUpdated} />
            </View>
            <InputField
                editable={false}
                title={_('Name')}
                titleDark
                value={surveyItem.title as string}
                placeholder={_('Enter survey name')}
                inputStyle={styles.disabledInputText}
            />
            <Text style={styles.title} title={_('Add Images')} />
            <ImagePicker
                onAddImage={handleAddImages}
                onRemoveImage={setNewImages}
                images={newImages}
                initialImages={
                    surveyItem.attachment
                        ? [...surveyItem.attachment].reverse()
                        : []
                }
                multiple
            />
            <Text style={styles.title} title={_('Location')} />
            <View style={styles.locationWrapper}>
                <Icon name="pin" height={20} width={20} fill={COLORS.grey600} />
                <Text
                    style={cs(styles.disabledInputText, styles.locationText)}
                    title={surveyLocation}
                />
            </View>
            <Text
                style={styles.title}
                title={_('How do you feel about this feature?')}
            />
            <SurveySentimentInput
                activeFeel={activeSentiment}
                onChange={setActiveSentiment}
                style={styles.pressInput}
            />
            {Boolean(initialSentiment) && (
                <View style={styles.initialValueContainer}>
                    <Text
                        style={styles.initialValueText}
                        title={('Previously ' + initialSentiment) as string}
                    />
                </View>
            )}
            <Text
                style={styles.title}
                title={_(
                    'Is the condition of this feature improving, staying the same, or decreasing?',
                )}
            />
            <SurveyReviewInput
                activeReview={activeReview}
                onChange={setActiveReview}
                style={styles.pressInput}
            />
            {Boolean(initialReview) && (
                <View style={styles.initialValueContainer}>
                    <Text
                        style={styles.initialValueText}
                        title={_('Previously ')}
                    />
                    <SurveyReviewIcon
                        name={initialReview as string}
                        isActive={false}
                    />
                </View>
            )}
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
                options={
                    surveyItem.project
                        ? projectVisibilityOptions
                        : visibilityOptions
                }
                style={styles.pressInput}
                value={surveyItem.isPublic}
                disabled
            />
            <Text
                style={styles.title}
                title={_('Is this real data or a test point?')}
            />
            <SurveyOptionInput
                options={testSurveyOptions}
                style={styles.pressInput}
                value={surveyItem.isTest}
                disabled
            />
            <Text style={styles.title} title={_('Add audio description')} />
            <AudioPicker
                onAddAudio={handleAudio}
                onRemoveAudio={setAudio}
                audio={audio}
            />
        </ScrollView>
    );
};

export default UpdateSurvey;
