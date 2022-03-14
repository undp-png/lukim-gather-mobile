import React from 'react';
import {View, Text} from 'react-native';

import {Localize} from '@rna/components/I18n';

import styles from './styles';

const About = () => {
    return (
        <View style={styles.container}>
            <Text>
                <Localize>About Lukim Gather</Localize>
            </Text>
        </View>
    );
};

export default About;
