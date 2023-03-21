import React, {useCallback, useState} from 'react';
import {View, Image, Modal, TouchableOpacity} from 'react-native';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

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
    image: string | null;
}

const EmptyImageList = () => (
    <Text style={styles.text} title={_('No images uploaded')} />
);

const ImageView: React.FC<ImageProps> = ({images}) => {
    const [openGallery, setOpenGallery] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImage = useCallback(
        item => {
            setOpenGallery(!openGallery);
            setSelectedImage(item.media);
        },
        [openGallery],
    );

    const renderImage = useCallback(
        ({item}: {item: {media: string}}) => (
            <TouchableWithoutFeedback onPress={() => handleImage(item)}>
                <Image
                    source={
                        {uri: item.media} ||
                        require('assets/images/category-placeholder.png')
                    }
                    style={styles.images}
                />
            </TouchableWithoutFeedback>
        ),
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
                        source={{
                            uri:
                                image ||
                                require('assets/images/category-placeholder.png'),
                        }}
                        style={styles.image}
                        resizeMode="contain"
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
            />
            <ImageModal isVisible={openGallery} image={selectedImage} />
        </>
    );
};

export default ImageView;
