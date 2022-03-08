import React, {useCallback} from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import MenuItem from 'components/MenuItem';

import styles from './styles';

const Menu = () => {
    const onPressLogout = useCallback(async () => {
        try {
            // todo logout
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.userInfoWrapper}>
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
                </View>
                <View style={styles.menuWrapper}>
                    <MenuItem title="Settings" linkTo="Settings" />
                    <MenuItem title="About Lukim Gather" linkTo="About" />
                    <MenuItem title="Feedbacks" linkTo="Feedbacks" />
                    <MenuItem title="Help" linkTo="Help" />
                    <TouchableOpacity
                        onPress={onPressLogout}
                        style={styles.menuItem}>
                        <Text style={styles.menuTitle} title="Log out" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.appVersion} title="Version 0.1" />
        </View>
    );
};

export default Menu;
