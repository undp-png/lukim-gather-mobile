import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import useQuery from 'hooks/useQuery';

import Map from 'components/Map';

const Home = () => {
    const {data, refetch} = useQuery(GET_HAPPENING_SURVEY, {
        variables: {ordering: '-modified_at'},
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const surveyData = useMemo(() => {
        return data?.happeningSurveys || [];
    }, [data]);

    return (
        <View>
            <Map surveyData={surveyData} showCluster showUserLocation />
        </View>
    );
};

export default Home;
