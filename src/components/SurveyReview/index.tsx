import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import Svg, {Path} from 'react-native-svg';

import cs from '@rna/utils/cs';

import {Maybe, SurveyHappeningSurveyImprovementChoices} from '@generated/types';

import styles from './styles';

interface Props {
    name: string;
    activeReview?: Maybe<SurveyHappeningSurveyImprovementChoices>;
    reviewItem?: boolean;
    onPress?(emo: string): void;
    icon?: string;
}

function useSurveyReviewIcon(improvementName: string) {
    switch (improvementName) {
        case 'INCREASING':
            return 'trending-up-outline';
        case 'DECREASING':
            return 'trending-down-outline';
        default:
            return null;
    }
}

interface ReviewIconProps {
    name: string;
    isActive: boolean;
}

export const SurveyReviewIcon = ({name, isActive}: ReviewIconProps) => {
    const icon = useSurveyReviewIcon(name);

    if (icon) {
        return (
            <Icon
                name={icon}
                height={25}
                width={25}
                fill={isActive ? '#EC6D25' : '#70747E'}
            />
        );
    }
    return (
        <Svg width="24" height="8" viewBox="0 0 19 7" fill="none">
            <Path
                d="M17.5725 0H1.47246C0.94779 0 0.522461 0.425329 0.522461 0.95V1.05C0.522461 1.57467 0.94779 2 1.47246 2H17.5725C18.0971 2 18.5225 1.57467 18.5225 1.05V0.95C18.5225 0.425329 18.0971 0 17.5725 0Z"
                fill={isActive ? '#EC6D25' : '#70747E'}
            />
            <Path
                d="M17.5725 5H1.47246C0.94779 5 0.522461 5.42533 0.522461 5.95V6.05C0.522461 6.57467 0.94779 7 1.47246 7H17.5725C18.0971 7 18.5225 6.57467 18.5225 6.05V5.95C18.5225 5.42533 18.0971 5 17.5725 5Z"
                fill={isActive ? '#EC6D25' : '#70747E'}
            />
        </Svg>
    );
};

const SurveyReview: React.FC<Props> = ({name, activeReview, onPress}) => {
    const handlePress = useCallback(() => {
        onPress && onPress(name);
    }, [name, onPress]);

    return (
        <Pressable
            style={cs(styles.feelWrapper, [
                styles.activeReviewItem,
                name === activeReview,
            ])}
            onPress={handlePress}>
            <View
                style={cs(styles.checked, [
                    styles.hide,
                    name !== activeReview,
                ])}>
                <Icon
                    name="checkmark-circle-2"
                    height={18}
                    width={18}
                    fill={'#196297'}
                />
            </View>
            <SurveyReviewIcon name={name} isActive={name === activeReview} />
        </Pressable>
    );
};

export default SurveyReview;
