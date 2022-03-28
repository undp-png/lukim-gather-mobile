import React, {useCallback, useState} from 'react';
import {FlatList, Image, Pressable, ScrollView, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image as ImageObj} from 'react-native-image-crop-picker';
import {Icon} from 'react-native-eva-icons';

import cs from '@rna/utils/cs';

import Text from 'components/Text';
import InputField from 'components/InputField';
import ImagePicker from 'components/ImagePicker';

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
    const renderItem = useCallback(
        ({item, index}: {item: {path: string}; index: number}) => (
            <Photo
                item={item}
                index={index}
                onCloseIconPress={handleRemoveImage}
            />
        ),
        [handleRemoveImage],
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

const CreateSurvey = () => {
    const [name, setName] = useState<string>('');
    const [activeFeel, setActiveFeel] = useState<string>('');
    const [images, setImages] = useState<ImageObj[]>([]);

    const handleFeel = useCallback(feel => {
        setActiveFeel(feel);
    }, []);

    const handleImages = useCallback(
        image => {
            setImages([image, ...images]);
        },
        [images],
    );

    const handleRemoveImage = useCallback(
        index => {
            const NewImages = images.filter((_, i) => i !== index);
            setImages(NewImages);
        },
        [images],
    );

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.categoryCont}>
                <View style={styles.category}>
                    <Image
                        source={require('assets/images/category-placeholder.png')}
                        style={styles.categoryIcon}
                    />
                    <Text style={styles.field} title="Trees" />
                </View>
                <TouchableOpacity>
                    <Text style={styles.change} title="Change" />
                </TouchableOpacity>
            </View>
            <InputField
                title="Name"
                titleDark
                input={name}
                onChangeText={setName}
                placeholder="2022 PNG Trees Study"
            />
            <Text style={styles.title} title="Add Images" />
            <View style={styles.addImages}>
                <View style={styles.photosWrapper}>
                    <Photos
                        photos={images}
                        handleRemoveImage={handleRemoveImage}
                    />
                </View>
                <View style={styles.imgPickerWrapper}>
                    <ImagePicker onChange={handleImages} />
                </View>
            </View>
            <Text style={styles.title} title="Location" />
            <View style={styles.locationCont}>
                <View style={styles.locationWrapper}>
                    <Icon name="pin" height={20} width={20} fill={'#80A8C5'} />
                    <Text style={styles.countyName} title="ABC County" />
                </View>
                <TouchableOpacity>
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
                placeholder="What’s happening here?"
            />
        </ScrollView>
    );
};

export default CreateSurvey;
