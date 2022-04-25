import React, {useEffect, useMemo} from 'react';
import {View, Image} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';

import styles from './styles';

const EditProfile = () => {
    const navigation = useNavigation();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton />,
        });
    });

    const nameValue = useMemo(() => {
        if (user) {
            return `${user.firstName} ${user.lastName}`;
        }
        return '';
    }, [user]);

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
                <InputField title={_('Name')} defaultValue={nameValue} />
                <InputField
                    title={_('Organization name')}
                    defaultValue={user?.organization}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default EditProfile;
