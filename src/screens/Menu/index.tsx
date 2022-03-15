import React, {useCallback} from 'react';
import {View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import {dispatchLogout} from 'services/dispatch';

import styles from './styles';

const Menu = () => {
    const navigation = useNavigation();
    const onProfilePress = useCallback(
        () => navigation.navigate('EditProfile'),
        [navigation],
    );
    const onPressLogout = useCallback(async () => {
        try {
            dispatchLogout();
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity
                    onPress={onProfilePress}
                    style={styles.userInfoWrapper}>
                    <Image
                        source={require('assets/images/user-placeholder.png')}
                        style={styles.userImage}
                    />
                    <View style={styles.userTextInfo}>
                        <View style={styles.textWrapper}>
                            <Text
                                style={styles.userName}
                                title="Alexander Doe"
                            />
                            <Text
                                style={styles.userOrg}
                                title="ABC Organization"
                            />
                        </View>
                        <Icon
                            name="arrow-ios-forward-outline"
                            height={18}
                            width={18}
                            fill={'#9fa3a9'}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.menuWrapper}>
                    <MenuItem title={_('Settings')} linkTo="Settings" />
                    <MenuItem title={_('About Lukim Gather')} linkTo="About" />
                    <MenuItem title={_('Feedbacks')} linkTo="Feedbacks" />
                    <MenuItem title={_('Help')} linkTo="Help" />
                    <TouchableOpacity
                        onPress={onPressLogout}
                        style={styles.menuItem}>
                        <Text style={styles.menuTitle} title={_('Log out')} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.appVersion} title={_('Version 0.1')} />
        </View>
    );
};

export default Menu;
