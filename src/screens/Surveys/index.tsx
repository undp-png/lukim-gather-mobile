import React, {useCallback, useState, useMemo} from 'react';
import {RefreshControl, View, ListRenderItem, FlatList} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import SurveyItem from 'components/SurveyItem';
import EmptyListMessage from 'components/EmptyListMessage';
import ExportActions from 'components/ExportActions';

import useQuery from 'hooks/useQuery';

import {_} from 'services/i18n';
import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import {HappeningSurveyType} from '@generated/types';

import styles from './styles';
import HomeHeader from 'components/HomeHeader';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const Surveys = () => {
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const {loading, data, refetch} = useQuery(GET_HAPPENING_SURVEY);

    const [selectedTab, setSelectedTab] = useState('all');

    const [isOpenExport, setIsOpenExport] = useState(false);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);
    useFocusEffect(handleRefresh);

    const selectedData = useMemo(
        () =>
            selectedTab === 'myentries'
                ? data?.happeningSurveys.filter(
                      (el: HappeningSurveyType) =>
                          el.createdBy?.id && el.createdBy?.id === user?.id,
                  )
                : data?.happeningSurveys,
        [data, selectedTab, user?.id],
    );

    const renderItem: ListRenderItem<HappeningSurveyType> = useCallback(
        ({item}: {item: HappeningSurveyType}) => <SurveyItem item={item} />,
        [],
    );

    return (
        <View style={styles.container}>
            <HomeHeader
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                onExportPress={toggleExportModal}
            />
            <FlatList
                data={selectedData || []}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
                ListEmptyComponent={loading ? null : EmptyListMessage}
            />
            <ExportActions
                isOpenExport={isOpenExport}
                onBackdropPress={toggleExportModal}
                onClickExportPDF={() => {}}
                onClickExportImage={() => {}}
                onClickExportCSV={() => {}}
            />
        </View>
    );
};

export default Surveys;
