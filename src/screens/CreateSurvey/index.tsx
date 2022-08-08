import React, {useCallback, useEffect, useState} from 'react';
import {
    Image,
    ScrollView,
    View,
    Platform,
    Switch,
    Pressable,
} from 'react-native';
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
    Improvement,
} from '@generated/types';

import {
    CREATE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import cs from '@rna/utils/cs';

import COLORS from 'utils/colors';

import styles from './styles';

interface OptionItemProps {
    iconName?: string;
    text?: string;
    onPress?: (arg0: any) => void;
    isActive?: boolean;
    style?: object;
}

const OptionItem: React.FC<OptionItemProps> = ({
    iconName,
    text,
    isActive,
    onPress,
    style,
}) => {
    return (
        <Pressable
            style={cs(
                styles.optionItem,
                [styles.activeOptionItem, isActive],
                style,
            )}
            onPress={onPress}>
            <View style={cs(styles.checked, [styles.hide, !isActive])}>
                <Icon
                    name="checkmark-circle-2"
                    height={18}
                    width={18}
                    fill={'#196297'}
                />
            </View>
            <Icon
                width={20}
                height={20}
                name={iconName}
                fill={isActive ? COLORS.accent : COLORS.greyTextDark}
            />
            <Text
                style={cs(styles.optionText, [
                    styles.optionTextActive,
                    isActive,
                ])}
                title={text}
            />
        </Pressable>
    );
};

const CreateHappeningSurvey = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const dispatch = useDispatch();

    const {location} = useSelector((state: RootStateOrAny) => state.survey);
    const {user, isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [activeFeel, setActiveFeel] = useState<string>('');
    const [activeReview, setActiveReview] = useState<Improvement | null>(null);
    const [images, setImages] = useState<ImageObj[]>([]);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<{
        id: number;
        name: string;
        icon: string;
    }>(route.params?.categoryItem);
    const [attachment, setAttachment] = useState<any>([]);
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

    const [isPublic, setPublic] = useState<boolean>(true);
    const [isTest, setTest] = useState<boolean>(false);

    const handlePublicPress = useCallback(() => setPublic(true), []);
    const handleNotPublicPress = useCallback(() => setPublic(false), []);

    const handleTestPress = useCallback(() => setTest(true), []);
    const handleNotTestPress = useCallback(() => setTest(false), []);

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
        let surveyInput = {
            id: uuid.v4(),
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
            isPublic,
            isTest,
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
                        category: {
                            id: category.id,
                            title: category.name,
                            __typename: 'ProtectedAreaCategoryType',
                        },
                        ...surveyInput,
                        attachment: [
                            ...surveyInput.attachment.map((file, i) => ({
                                media: file.uri,
                                id: file.name,
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
                    const readData: any = cache.readQuery({
                        query: GET_HAPPENING_SURVEY,
                    }) || {happeningSurveys: []};
                    let mergedSurveys = [];

                    if (readData.happeningSurveys?.length <= 0) {
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
    }, [
        title,
        description,
        category,
        createHappeningSurvey,
        activeFeel,
        activeReview,
        attachment,
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
            response.forEach(async (res: ImageObj) => {
                const image = {
                    name: uuid.v4(),
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

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.categoryCont}>
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image source={categoryIcon} style={styles.categoryIcon} />
                    <Text style={styles.field} title={_(category.name)} />
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
                </>
            )}
            <Text
                style={styles.title}
                title={_('Is this real data or a test point?')}
            />
            <View style={styles.feelings}>
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
                setCategory={setCategory}
                setOpenCategory={setOpenCategory}
                onToggleModal={toggleOpenCategory}
                isOpen={openCategory}
            />
        </ScrollView>
    );
};

export default CreateHappeningSurvey;
