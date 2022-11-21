import React from 'react';
import {View} from 'react-native';

import {Maybe, SurveyHappeningSurveyImprovementChoices} from '@generated/types';

import SurveyReview from './index';
export {SurveyReviewIcon} from './index';

interface ReviewInputProps {
    activeReview?: Maybe<SurveyHappeningSurveyImprovementChoices>;
    onChange: (review: SurveyHappeningSurveyImprovementChoices) => void;
    style: object;
}

const reviews = ['INCREASING', 'SAME', 'DECREASING'];

const ReviewInput: React.FC<ReviewInputProps> = props => {
    const {style, activeReview, onChange} = props;

    return (
        <View style={style}>
            {reviews.map((r: string, i: number) => (
                <SurveyReview
                    key={String(i)}
                    name={r}
                    activeReview={activeReview}
                    onPress={onChange}
                />
            ))}
        </View>
    );
};

export default ReviewInput;
