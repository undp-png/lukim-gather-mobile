import React from 'react';
import {View, Text} from 'react-native';
import {Localize} from '@rna/components/I18n';

import styles from './styles';

const Help = () => {
    return (
        <View style={styles.container}>
            <Text>
                <Localize>Help</Localize>
            </Text>
        </View>
    );
};

export default Help;
