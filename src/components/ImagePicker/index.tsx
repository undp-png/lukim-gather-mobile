import React, {useCallback, useRef} from 'react';
import {
    Pressable,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
    Animated,
    Image,
    FlatList,
} from 'react-native';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {Icon} from 'react-native-eva-icons';

import cs from '@rna/utils/cs';

import styles from './styles';

interface PhotoProps {
    item: {path: string};
    index: number;
    onCloseIconPress(index: number): void;
}

interface PhotosProps {
    photos: {path: string; media: string}[];
    onRemoveImage(index: number): void;
}

interface ImagePickerProps {
    images: ImageType[];
    onChange: (file: ImageType) => void;
    onRemoveImage: (images: ImageType[]) => void;
    multiple?: boolean;
    disabled?: boolean;
}

interface ImagePickerModalProps {
    onChange: (file: ImageType) => void;
    multiple?: boolean;
    disabled?: boolean;
    isVisible: boolean;
    onBackdropPress(): void;
}

const deviceHeight = Dimensions.get('window').height;

const Photo: React.FC<PhotoProps> = ({item, index, onCloseIconPress}) => {
    const handleCloseIconPress = useCallback(() => {
        onCloseIconPress(index);
    }, [index, onCloseIconPress]);

    return (
        <View style={styles.surveyImageWrapper}>
            <Image
                source={
                    {uri: item.media || item.path} ||
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

const Photos: React.FC<PhotosProps> = ({photos, onRemoveImage}) => {
    const listRef = useRef<FlatList>(null);
    const handleCloseIcon = useCallback(
        (index: number) => {
            onRemoveImage(index);
            listRef.current?.scrollToIndex({animated: true, index: 0});
        },
        [onRemoveImage],
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

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    onChange,
    multiple,
    isVisible,
    onBackdropPress,
}) => {
    const handleCamera = useCallback(async () => {
        try {
            const image = await ImagePicker.openCamera({
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.7,
                multiple,
            });
            if (image) {
                onChange?.(image);
            }
        } catch (error) {}
    }, [multiple, onChange]);

    const handleGallery = useCallback(async () => {
        try {
            const image = await ImagePicker.openPicker({
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.7,
                multiple,
            });
            if (image) {
                onChange?.(image);
            }
        } catch (error) {}
    }, [onChange, multiple]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            backdropTransitionOutTiming={10}
            statusBarTranslucent={true}
            deviceHeight={deviceHeight}
            style={styles.modal}>
            <View style={styles.options}>
                <Pressable style={styles.option} onPress={handleGallery}>
                    <Icon
                        name="image"
                        height={25}
                        width={25}
                        fill={'#284362'}
                    />
                    <Text style={styles.optionText}>Gallery</Text>
                </Pressable>
                <Pressable style={styles.option} onPress={handleCamera}>
                    <Icon
                        name="camera"
                        height={25}
                        width={25}
                        fill={'#284362'}
                    />
                    <Text style={styles.optionText}>Camera</Text>
                </Pressable>
            </View>
        </Modal>
    );
};

const _ImagePicker: React.FC<ImagePickerProps> = ({
    images,
    onChange: onChangeCallback,
    multiple,
    onRemoveImage: onRemoveCallback,
    disabled,
}) => {
    const [visible, setVisible] = React.useState(false);

    const iconFlex = useRef(
        new Animated.Value(images.length >= 1 ? 0.2 : 1),
    ).current;
    const imgFlex = useRef(
        new Animated.Value(images.length >= 1 ? 1 : 0),
    ).current;

    const close = useCallback(() => {
        setVisible(false);
    }, []);

    const open = useCallback(() => {
        setVisible(true);
    }, []);

    const onChange = useCallback(
        response => {
            if ((multiple && response.length >= 1) || images.length === 1) {
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
            onChangeCallback(response);
            close();
        },
        [multiple, images.length, onChangeCallback, close, iconFlex, imgFlex],
    );

    const onRemoveImage = useCallback(
        (index: number) => {
            const newImages = images.filter(
                (_: ImageType, i: number) => i !== index,
            );

            if (newImages.length === 1) {
                Animated.timing(iconFlex, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
            if (newImages.length === 0) {
                Animated.timing(imgFlex, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
            onRemoveCallback(newImages);
        },
        [onRemoveCallback, images, iconFlex, imgFlex],
    );

    return (
        <>
            <View style={styles.addImages}>
                <Animated.View style={cs({flex: imgFlex})}>
                    <Photos photos={images} onRemoveImage={onRemoveImage} />
                </Animated.View>
                {(multiple || images.length !== 1) && (
                    <Animated.View
                        style={cs(styles.imgPickerWrapper, {flex: iconFlex})}>
                        <TouchableOpacity
                            style={images.length < 1 && styles.emptyAddWrapper}
                            onPress={open}
                            disabled={disabled}>
                            <Icon
                                name="plus-circle"
                                height={40}
                                width={40}
                                fill={'#99B9D1'}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
            <ImagePickerModal
                isVisible={visible}
                onBackdropPress={close}
                onChange={onChange}
                multiple
            />
        </>
    );
};

export default _ImagePicker;
