import React from 'react';
import {View} from 'react-native';
import Text from 'components/Text';

import PickerSelect from '@rna/components/PickerSelect';

import cs from '@rna/utils/cs';

import styles from './styles';

const _PickerSelect = ({label, ...pickerProps}) => {
    return (
        <>
            <Text style={cs(styles.label)} title={label} />
            <View style={styles.pickerWrapper}>
                <PickerSelect
                    style={styles.picker}
                    color="#888C94"
                    {...pickerProps}
                />
            </View>
        </>
    );
};

export default _PickerSelect;
