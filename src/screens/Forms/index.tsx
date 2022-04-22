import React from 'react';
import {View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

const formList = [
    {
        id: 1,
        title: 'Local Environmental Survey',
    },
];

const FormMenuItem = ({item}) => {
    return (
        <MenuItem title={item.title} linkTo="FillForm" params={{form: item}} />
    );
};

const Forms = () => {
    const {user} = useSelector(state => state.auth);

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <FlatList
                    data={formList}
                    renderItem={FormMenuItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    );
};

export default Forms;
