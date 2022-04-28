import React, {useCallback, useEffect, useState} from 'react';
import {Image, Pressable, ScrollView, View, Platform} from 'react-native';
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
import {SurveyConfirmBox} from 'components/SurveyConfirmationBox';
import {ModalLoader} from 'components/Loader';
import CategoryListModal from 'components/CategoryListModal';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';

import {
    CreateHappeningSurveyMutation,
    CreateHappeningSurveyMutationVariables,
    UploadMediaMutation,
    UploadMediaMutationVariables,
} from '@generated/types';

import {
    CREATE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
    UPLOAD_IMAGE,
} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

import styles from './styles';
interface FeelProps {
    feel: string;
    activeFeel: string;
    onPress(emo: string): void;
}

const Feel: React.FC<FeelProps> = ({feel, activeFeel, onPress}) => {
    const handlePress = useCallback(() => {
        onPress(feel);
    }, [feel, onPress]);

    return (
        <Pressable
            style={cs(styles.feeelWrapper, [
                styles.activeFeel,
                feel === activeFeel,
            ])}
            onPress={handlePress}>
            <View
                style={cs(styles.checked, [styles.hide, feel !== activeFeel])}>
                <Icon
                    name="checkmark-circle-2"
                    height={18}
                    width={18}
                    fill={'#196297'}
                />
            </View>
            <Text style={styles.feelIcon} title={feel} />
        </Pressable>
    );
};

const CreateHappeningSurvey = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const {location} = useSelector((state: RootStateOrAny) => state.survey);
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [activeFeel, setActiveFeel] = useState<string>('');
    const [images, setImages] = useState<ImageObj[]>([]);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<{
        id: number;
        name: string;
        icon: string;
    }>(route.params?.categoryItem);
    const [attachment, setAttachment] = useState<any>([]);
    const [confirmPublish, setConfirmPublish] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<object | null>(null);
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [locationDetail, setLocationDetail] =
        useState<string>('Current Location');

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

    const handlePublish = useCallback(async () => {
        setProcessing(true);
        let surveyInput = {
            title: title,
            description: description,
            sentiment: activeFeel,
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
            },
            optimisticResponse: {
                createHappeningSurvey: {
                    __typename: 'HappeningSurveyType',
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
        attachment,
        location,
        navigation,
        user?.id,
    ]);

    const [uploadFile] = useMutation<
        UploadMediaMutation,
        UploadMediaMutationVariables
    >(UPLOAD_IMAGE, {
        onCompleted: res => {
            setAttachment([res?.uploadMedia.result.id, ...attachment]);
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleFeel = useCallback(feel => {
        setActiveFeel(feel);
    }, []);

    const handleImages = useCallback(
        async response => {
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
                await uploadFile({
                    variables: {
                        media: media,
                        title: `survey-${Date.now()}`,
                        type: 'image',
                    },
                });
            });
        },
        [images, uploadFile],
    );

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation');
    }, [navigation]);

    const handleConfirmToggle = useCallback(() => {
        if (title) {
            setConfirmPublish(!confirmPublish);
        }
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
            setIsAnonymous(isAnonymous);
        },
        [isAnonymous],
    );

    useEffect(() => {
        setCoordinates(location);
        if (coordinates && coordinates.polygon) {
            setLocationDetail('Boundaries');
        } else if (coordinates && coordinates.point) {
            setLocationDetail(`${coordinates?.point}`);
        } else {
            setLocationDetail('Choose the location');
        }
    }, [location, coordinates]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <SurveyConfirmBox
                    updateAnonymousStatus
                    isOpen={confirmPublish}
                    onCancel={handleCancel}
                    onSubmit={handlePublish}
                />
                <ModalLoader loading={processing} />
                <View style={styles.category}>
                    <Image
                        source={
                            route.params.categoryItem.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
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
                <Feel feel="🙁" activeFeel={activeFeel} onPress={handleFeel} />
                <Feel feel="🙂" activeFeel={activeFeel} onPress={handleFeel} />
                <Feel feel="😐" activeFeel={activeFeel} onPress={handleFeel} />
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
