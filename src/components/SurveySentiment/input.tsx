import React from 'react';
import {View} from 'react-native';

import SurveySentiment from './index';

interface SentimentInputProps {
    activeFeel: string;
    onChange: (feel: string) => void;
    style: object;
}

const feels = ['🙁', '🙂', '😐'];

const SentimentInput: React.FC<SentimentInputProps> = props => {
    const {style, activeFeel, onChange} = props;

    return (
        <View style={style}>
            {feels.map((f: string, i: number) => (
                <SurveySentiment
                    key={String(i)}
                    feel={f}
                    activeFeel={activeFeel}
                    onPress={onChange}
                />
            ))}
        </View>
    );
};

export default SentimentInput;
