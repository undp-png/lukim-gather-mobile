import React, {useCallback} from 'react';
import {View, Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import styles from './styles';

const ForwardIcon = () => {
    return (
        <Icon
            name="arrow-ios-forward-outline"
            height={18}
            width={18}
            fill={'#9fa3a9'}
        />
    );
};

const MenuItem = ({title, linkTo}) => {
    const navigation = useNavigation();
    const onPressMenu = useCallback(
        () => navigation.navigate(linkTo),
        [linkTo, navigation],
    );
    return (
        <TouchableOpacity onPress={onPressMenu} style={styles.menuItem}>
            <Text style={styles.menuTitle}>{title}</Text>
            <ForwardIcon />
        </TouchableOpacity>
    );
};

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
                            <Text style={styles.userName}>Alexander Doe</Text>
                            <Text style={styles.userOrg}>ABC Organization</Text>
                        </View>
                        <ForwardIcon />
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
                        <Text style={styles.menuTitle}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.appVersion}>Version 0.1</Text>
        </View>
    );
};

export default Menu;
