import React, {useCallback, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    UIManager,
    LayoutAnimation,
} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import COLORS from 'utils/colors';

import styles from './styles';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({
    item,
    renderContent,
}: {
    item: any;
    renderContent?: (contentItem: any) => void;
}) => {
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = useCallback(() => {
        LayoutAnimation.configureNext(
            LayoutAnimation.create(300, 'linear', 'opacity'),
        );
        setExpanded(!expanded);
    }, [expanded]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.header}
                onPress={toggleAccordion}>
                <Text style={styles.headerTitle}>{item?.title}</Text>
                <Icon
                    name={
                        expanded
                            ? 'arrow-ios-downward-outline'
                            : 'arrow-ios-forward-outline'
                    }
                    fill={COLORS.grey600}
                    width={24}
                    height={24}
                />
            </TouchableOpacity>
            {expanded &&
                (renderContent ? (
                    renderContent(item)
                ) : (
                    <Text style={styles.content}>{item?.description}</Text>
                ))}
        </View>
    );
};

export default Accordion;
