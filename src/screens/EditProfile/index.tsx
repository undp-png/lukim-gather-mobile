import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import TextInput from 'components/TextInput';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';

import styles from './styles';

const EditProfile = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton />,
        });
    });
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <TouchableOpacity style={styles.imageWrapper}>
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
                        source={require('assets/images/user-placeholder.png')}
                        style={styles.userImage}
                    />
                    <Text
                        style={styles.changeTitle}
                        title={_('Change photo')}
                    />
                </TouchableOpacity>
                <TextInput label={_('Name')} />
                <TextInput label={_('Organization name')} />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default EditProfile;
