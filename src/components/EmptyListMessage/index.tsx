import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import {_} from 'services/i18n';

import styles from './styles';

const EmptyListMessage = () => {
    return (
        <View style={styles.emptyContainer}>
            <Icon name="file-text" height={50} width={50} fill={'#888C94'} />
            <Text style={styles.text} title={_('No data Found')} />
        </View>
    );
};

export default EmptyListMessage;
