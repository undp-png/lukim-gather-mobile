import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import cs from '@rna/utils/cs';

import styles from './styles';

interface Props {
    feel: string;
    activeFeel: string;
    onPress(emo: string | null): void;
}

const SurveySentiment: React.FC<Props> = ({feel, activeFeel, onPress}) => {
    const handlePress = useCallback(() => {
        feel === activeFeel ? onPress(null) : onPress(feel);
    }, [feel, onPress, activeFeel]);

    return (
        <Pressable
            style={cs(styles.feeelWrapper, [
                styles.activeFeel,
                feel === activeFeel,
            ])}
            onPress={handlePress}>
            <View
                style={cs(styles.checked, [styles.hide, feel !== activeFeel])}>
                <Icon
                    name="checkmark-circle-2"
                    height={18}
                    width={18}
                    fill={'#196297'}
                />
            </View>
            <Text style={styles.feelIcon} title={feel} />
        </Pressable>
    );
};

export default SurveySentiment;
