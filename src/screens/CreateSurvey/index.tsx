import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Animated,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    View,
    Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useMutation, gql} from '@apollo/client';
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
import {SurveyConfirmBox} from 'components/SurveyConfirmationBox';
import {ModalLoader} from 'components/Loader';

import cs from '@rna/utils/cs';
import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import {
    CreateSurveyMutation,
    CreateSurveyMutationVariables,
    UploadMediaMutation,
    UploadMediaMutationVariables,
} from '@generated/types';

import {getErrorMessage} from 'utils/error';

import styles from './styles';

interface FeelProps {
    feel: string;
    activeFeel: string;
    onPress(emo: string): void;
}

interface PhotoProps {
    item: {path: string};
    index: number;
    onCloseIconPress(index: number): void;
}

interface PhotosProps {
    photos: {path: string}[];
    handleRemoveImage(index: number): void;
}

const CREATE_SURVEY = gql`
    mutation CreateSurvey($input: LocalEnviromentalSurveyInput!) {
        createSurvey(data: $input) {
            errors
            ok
            result {
                id
            }
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation UploadMedia($title: String!, $type: String!, $media: Upload) {
        uploadMedia(title: $title, type: $type, media: $media) {
            ok
            result {
                id
            }
        }
    }
`;

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

const Photo: React.FC<PhotoProps> = ({item, index, onCloseIconPress}) => {
    const handleCloseIconPress = useCallback(() => {
        onCloseIconPress(index);
    }, [index, onCloseIconPress]);

    return (
        <View style={styles.surveyImageWrapper}>
            <Image
                source={
                    {uri: item.path} ||
                    require('assets/images/category-placeholder.png')
                }
                style={styles.surveyImage}
            />
            <Pressable style={styles.closeIcon} onPress={handleCloseIconPress}>
                <Icon
                    name="close-circle"
                    height={20}
                    width={20}
                    fill={'#fff'}
                />
            </Pressable>
        </View>
    );
};

const Photos: React.FC<PhotosProps> = ({photos, handleRemoveImage}) => {
    const listRef = useRef<FlatList>(null);
    const handleCloseIcon = useCallback(
        (index: number) => {
            handleRemoveImage(index);
            listRef.current?.scrollToIndex({animated: true, index: 0});
        },
        [handleRemoveImage],
    );

    const renderItem = useCallback(
        ({item, index}: {item: {path: string}; index: number}) => (
            <Photo
                item={item}
                index={index}
                onCloseIconPress={handleCloseIcon}
            />
        ),
        [handleCloseIcon],
    );
    return (
        <FlatList
            ref={listRef}
            data={photos}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const CreateSurvey = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const {location} = useSelector(state => state.survey);

    const [title, setTitle] = useState<string>('');
    const [activeFeel, setActiveFeel] = useState<string>('');
    const [images, setImages] = useState<ImageObj[]>([]);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<number>(
        route.params?.categoryItem.id,
    );
    const [attachment, setAttachment] = useState<any>([]);
    const [confirmPublish, setConfirmPublish] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState(null);

    const iconFlex = useRef(new Animated.Value(1)).current;
    const imgFlex = useRef(new Animated.Value(0)).current;

    const [createSurvey, {loading, error}] = useMutation<
        CreateSurveyMutation,
        CreateSurveyMutationVariables
    >(CREATE_SURVEY, {
        onCompleted: () => {
            Toast.show('Survey Created Sucessfully !');
            navigation.navigate('Feed');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handlePublish = useCallback(async () => {
        await createSurvey({
            variables: {
                input: {
                    title: title,
                    description: description,
                    categoryId: category,
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
                },
            },
        });
    }, [
        createSurvey,
        title,
        description,
        category,
        activeFeel,
        attachment,
        location,
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
            setImages([response, ...images]);
            if (images.length === 1) {
                Animated.timing(iconFlex, {
                    toValue: 0.2,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            if (images.length === 0) {
                Animated.timing(imgFlex, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            const image = {
                name: response.path.substring(
                    response.path.lastIndexOf('/') + 1,
                ),
                type: response.mime,
                uri:
                    Platform.OS === 'ios'
                        ? response.path.replace('file://', '')
                        : response.path,
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
        },
        [iconFlex, images, imgFlex, uploadFile],
    );

    const handleRemoveImage = useCallback(
        index => {
            const NewImages = images.filter((_, i) => i !== index);
            setImages(NewImages);
            if (NewImages.length === 1) {
                Animated.timing(iconFlex, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
            if (NewImages.length === 0) {
                Animated.timing(imgFlex, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
        },
        [iconFlex, images, imgFlex],
    );

    const handleChangeLocation = useCallback(() => {
        navigation.navigate('ChangeLocation');
        setCoordinates(location);
    }, [navigation, location]);

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

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <SurveyConfirmBox
                    isOpen={confirmPublish}
                    onCancel={handleCancel}
                    onSubmit={handlePublish}
                />
                <ModalLoader loading={loading} />
                <View style={styles.category}>
                    <Image
                        source={
                            route.params.categoryItem.icon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                    <Text
                        style={styles.field}
                        title={route.params.categoryItem.name}
                    />
                </View>
                <TouchableOpacity>
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
            <View style={styles.addImages}>
                <Animated.View style={cs({flex: imgFlex})}>
                    <Photos
                        photos={images}
                        handleRemoveImage={handleRemoveImage}
                    />
                </Animated.View>
                <Animated.View
                    style={cs(styles.imgPickerWrapper, {flex: iconFlex})}>
                    <ImagePicker onChange={handleImages} />
                </Animated.View>
            </View>
            <Text style={styles.title} title="Location" />
            <View style={styles.locationCont}>
                <View style={styles.locationWrapper}>
                    <Icon name="pin" height={20} width={20} fill={'#80A8C5'} />
                    <Text
                        style={styles.countyName}
                        title={
                            coordinates
                                ? coordinates?.polygon
                                    ? 'Polygon'
                                    : `${coordinates?.point}`
                                : 'Choose the location'
                        }
                    />
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
        </ScrollView>
    );
};

export default CreateSurvey;
