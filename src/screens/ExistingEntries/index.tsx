import React, {useCallback} from 'react';
import {View} from 'react-native';
import {
    useNavigation,
    useRoute,
    type RouteProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

import Map from 'components/Map';

import type {HappeningSurveyType} from '@generated/types';
import type {StackParamList} from 'navigation';

import styles from './styles';

type ExistingEntriesRouteProp = RouteProp<StackParamList, 'ExistingEntries'>;

const ExistingEntries = () => {
    const {params} = useRoute<ExistingEntriesRouteProp>();

    const navigation = useNavigation<StackNavigationProp<StackParamList>>();

    const handleSurveyEntryPress = useCallback(
        (survey: HappeningSurveyType) => {
            navigation.navigate('UpdateSurvey', {surveyItem: survey});
        },
        [navigation],
    );

    return (
        <View style={styles.container}>
            <View style={styles.map}>
                <Map
                    isStatic
                    surveyData={params.existingSurveys}
                    showCluster
                    hideHeader
                    locationBarStyle={styles.locationBar}
                    onSurveyEntryPress={handleSurveyEntryPress}
                />
            </View>
        </View>
    );
};

export default ExistingEntries;
