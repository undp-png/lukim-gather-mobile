import React, {useEffect, useCallback, useState} from 'react';
import {View, Image, Platform} from 'react-native';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Text from 'components/Text';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {ModalLoader} from 'components/Loader';
import {ImagePickerModal} from 'components/ImagePicker';

import {_} from 'services/i18n';
import {UPDATE_USER} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import Toast from 'utils/toast';

import {setUser} from 'store/slices/auth';

import styles from './styles';

type ImageType = {
    name: string;
    uri: string;
    mime: string;
};

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const [visiblePickerModal, setVisiblePickerModal] = useState(false);

    const toggleImagePickerModal = useCallback(() => {
        setVisiblePickerModal(!visiblePickerModal);
    }, [visiblePickerModal]);

    const [fullName, setFullName] = useState(
        user.firstName ? user.firstName + ' ' + user.lastName : '',
    );
    const [organization, setOrganization] = useState(user?.organization);
    const [avatar, setAvatar] = useState<ImageType | undefined>();

    const [updateUser, {loading}] = useMutation(UPDATE_USER, {
        onCompleted: res => {
            Toast.show(_('Updated!'));
            navigation.navigate('Menu');
            dispatch(setUser(res?.updateUser?.result));
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handleSavePress = useCallback(async () => {
        const name = fullName.split(' ');
        const firstName = name[0];
        const lastName = fullName.substring(name[0].length).trim();
        await updateUser({
            variables: {
                data: {
                    firstName,
                    lastName,
                    organization,
                    avatar: avatar,
                },
            },
            optimisticResponse: {
                updateUser: {
                    __typename: 'UpdateUser',
                    errors: [],
                    ok: null,
                    result: {
                        firstName,
                        lastName,
                        organization,
                        avatar,
                    },
                },
            },
        });
    }, [fullName, organization, avatar, updateUser]);

    const handleImages = useCallback(
        async res => {
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
            setAvatar(media);
            toggleImagePickerModal();
        },
        [toggleImagePickerModal],
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleSavePress} />,
        });
    });

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    onPress={toggleImagePickerModal}
                    style={styles.imageWrapper}>
                    <View style={styles.overlay}>
                        <Icon
                            style={styles.camera}
                            name="camera"
                            height={22}
                            width={22}
                            fill={'#ffffff'}
                        />
                    </View>
                    <Image
                        source={
                            user.avatar || avatar
                                ? {uri: avatar?.uri || user.avatar}
                                : require('assets/images/user-placeholder.png')
                        }
                        style={styles.userImage}
                    />
                    <Text
                        style={styles.changeTitle}
                        title={_('Change photo')}
                    />
                </TouchableOpacity>
                <InputField
                    title={_('Name')}
                    value={fullName}
                    onChangeText={setFullName}
                />
                <InputField
                    title={_('Organization name')}
                    value={organization}
                    onChangeText={setOrganization}
                />
            </KeyboardAwareScrollView>
            <ImagePickerModal
                isVisible={visiblePickerModal}
                onBackdropPress={toggleImagePickerModal}
                onChange={handleImages}
            />
        </View>
    );
};

export default EditProfile;
