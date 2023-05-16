import React, {useCallback, useState} from 'react';
import {View, Image, Modal, TouchableOpacity} from 'react-native';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNetInfo} from '@react-native-community/netinfo';

import Text from 'components/Text';

import type {GalleryType} from '@generated/types';

import COLORS from 'utils/colors';
import {_} from 'services/i18n';

import styles from './styles';

interface ImageProps {
    images: GalleryType[];
}

interface PhotoProps {
    isVisible: boolean;
    image: string;
}

const EmptyImageList = () => (
    <Text style={styles.text} title={_('No images uploaded')} />
);

const ImageItem: React.FC<{
    item: GalleryType;
    onPress: (item: GalleryType) => void;
}> = ({item, onPress}) => {
    const {isInternetReachable} = useNetInfo();

    const handlePress = useCallback(() => {
        onPress(item);
    }, [onPress, item]);

    const [error, setError] = useState<string | null>(null);

    const handleImageError = useCallback(() => {
        if (!isInternetReachable) {
            setError(_('Cannot load image while offline!'));
        } else {
            setError(_('Error loading image!'));
        }
    }, [isInternetReachable]);

    const handleImageLoad = useCallback(() => setError(null), []);

    return (
        <View style={styles.imageContainer}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <Image
                    source={
                        {uri: item.media as string} ||
                        require('assets/images/category-placeholder.png')
                    }
                    style={styles.images}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
                {Boolean(error) && (
                    <View style={styles.errorTextContainer}>
                        <Text title={error} style={styles.errorText} />
                    </View>
                )}
            </TouchableWithoutFeedback>
        </View>
    );
};

const ImageView: React.FC<ImageProps> = ({images}) => {
    const [openGallery, setOpenGallery] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string>('');

    const handleImage = useCallback(
        item => {
            setOpenGallery(!openGallery);
            setSelectedImage(item.media);
        },
        [openGallery],
    );

    const renderImage = useCallback(
        renderProps => <ImageItem {...renderProps} onPress={handleImage} />,
        [handleImage],
    );

    const ImageModal: React.FC<PhotoProps> = ({isVisible, image}) => {
        return (
            <Modal
                animationType="slide"
                visible={isVisible}
                presentationStyle="fullScreen"
                onRequestClose={() => {
                    setOpenGallery(false);
                }}>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => setOpenGallery(false)}
                        style={styles.closeIcon}>
                        <Icon
                            name="close-outline"
                            height={30}
                            width={30}
                            fill={COLORS.tertiary}
                        />
                    </TouchableOpacity>
                    <Image
                        source={
                            {uri: image} ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.image}
                    />
                </View>
            </Modal>
        );
    };

    return (
        <>
            <FlatList
                data={images}
                renderItem={renderImage}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={EmptyImageList}
                removeClippedSubviews={true}
            />
            <ImageModal isVisible={openGallery} image={selectedImage} />
        </>
    );
};

export default ImageView;
