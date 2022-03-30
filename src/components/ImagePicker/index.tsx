import React, {useCallback} from 'react';
import {Pressable, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {Icon} from 'react-native-eva-icons';

import styles from './styles';

interface Props {
    onChange?: (file: Image) => void;
}

const _ImagePicker: React.FC<Props> = ({onChange}) => {
    const [visible, setVisible] = React.useState(false);

    const close = useCallback(() => {
        setVisible(false);
    }, []);

    const open = useCallback(() => {
        setVisible(true);
    }, []);

    const handleCamera = useCallback(async () => {
        try {
            const image = await ImagePicker.openCamera({
                cropping: true,
                freeStyleCropEnabled: true,
            });
            if (image) {
                onChange?.(image);
                close();
            }
        } catch (error) {}
    }, [close, onChange]);

    const handleGallery = useCallback(async () => {
        try {
            const image = await ImagePicker.openPicker({
                cropping: true,
                freeStyleCropEnabled: true,
            });
            if (image) {
                onChange?.(image);
                close();
            }
        } catch (error) {}
    }, [close, onChange]);

    return (
        <>
            <TouchableOpacity onPress={open}>
                <Icon
                    name="plus-circle"
                    height={40}
                    width={40}
                    fill={'#99B9D1'}
                />
            </TouchableOpacity>
            <Modal
                isVisible={visible}
                onBackdropPress={close}
                backdropTransitionOutTiming={10}
                style={styles.modal}>
                <SafeAreaView style={styles.options}>
                    <Pressable style={styles.option} onPress={handleGallery}>
                        <Icon
                            name="image"
                            height={25}
                            width={25}
                            fill={'#284362'}
                        />
                        <Text>Gallery</Text>
                    </Pressable>
                    <Pressable style={styles.option} onPress={handleCamera}>
                        <Icon
                            name="camera"
                            height={25}
                            width={25}
                            fill={'#284362'}
                        />
                        <Text>Camera</Text>
                    </Pressable>
                </SafeAreaView>
            </Modal>
        </>
    );
};

export default _ImagePicker;
