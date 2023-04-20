import React, {useRef, useCallback, useState, useMemo, useEffect} from 'react';
import {
    RefreshControl,
    View,
    ListRenderItem,
    FlatList,
    PermissionsAndroid,
    Platform,
    TouchableOpacity,
} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';

import Text from 'components/Text';
import SurveyItem from 'components/SurveyItem';
import EmptyListMessage from 'components/EmptyListMessage';
import ExportActions from 'components/ExportActions';

import useQuery from 'hooks/useQuery';

import {jsonToCSV} from 'utils';
import sentimentName from 'utils/sentimentName';
import {_} from 'services/i18n';
import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import {HappeningSurveyType} from '@generated/types';

import type {ProjectType} from '@generated/types';
import type {LocalCategoryType} from 'services/data/surveyCategory';

import styles from './styles';
import HomeHeader from 'components/HomeHeader';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const Surveys = () => {
    const viewShotRef = useRef<any>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const route = useRoute<any>();

    const {loading, data, refetch} = useQuery(GET_HAPPENING_SURVEY, {
        variables: {ordering: '-modified_at'},
    });

    const [selectedTab, setSelectedTab] = useState('all');

    const [isOpenExport, setIsOpenExport] = useState(false);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);
    useFocusEffect(handleRefresh);

    const [categoryFilterId, setCategoryFilterId] = useState<
        null | LocalCategoryType['id']
    >(route?.params?.filters?.categoryFilterId || null);
    const [projectFilterId, setProjectFilterId] = useState<
        null | ProjectType['id']
    >(route?.params?.filters?.projectFilterId || null);

    useEffect(() => {
        if (route?.params?.filters?.categoryFilterId !== undefined) {
            setCategoryFilterId(route.params.filters.categoryFilterId);
        }
        if (route?.params?.filters?.projectFilterId !== undefined) {
            setProjectFilterId(route.params.filters.projectFilterId);
        }
    }, [route?.params?.filters]);

    const selectedData = useMemo(() => {
        const filteredData = (data?.happeningSurveys || []).filter(
            (el: HappeningSurveyType) => {
                if (categoryFilterId && projectFilterId) {
                    return (
                        el?.category?.id &&
                        Number(el.category.id) === Number(categoryFilterId) &&
                        el?.project?.id &&
                        el.project.id === projectFilterId
                    );
                }
                if (categoryFilterId) {
                    return (
                        el?.category?.id &&
                        Number(el.category.id) === Number(categoryFilterId)
                    );
                }
                if (projectFilterId) {
                    return el?.project?.id && el.project.id === projectFilterId;
                }
                return true;
            },
        );

        return selectedTab === 'myentries'
            ? filteredData.filter(
                  (el: HappeningSurveyType) =>
                      el.createdBy?.id && el.createdBy?.id === user?.id,
              )
            : filteredData;
    }, [
        data?.happeningSurveys,
        selectedTab,
        user?.id,
        categoryFilterId,
        projectFilterId,
    ]);

    const renderItem: ListRenderItem<HappeningSurveyType> = useCallback(
        ({item}: {item: HappeningSurveyType}) => <SurveyItem item={item} />,
        [],
    );

    const getPermissionAndroid = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: _('Image export permission'),
                    message: _('Your permission is required to save image'),
                    buttonNegative: _('Cancel'),
                    buttonPositive: _('OK'),
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
            Toast.show(_('Permission required'));
        } catch (err) {
            console.log('Error' + err);
        }
    }, []);

    const onClickExportImage = useCallback(async () => {
        try {
            await viewShotRef.current.capture().then((uri: any) => {
                console.log(uri);
                if (Platform.OS === 'android') {
                    const granted = getPermissionAndroid();
                    if (!granted) {
                        return;
                    }
                }
                CameraRoll.save(uri, {
                    type: 'photo',
                    album: 'Lukim Gather',
                });
                Toast.show(_('Saved image in gallery!'));
                return setIsOpenExport(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, [getPermissionAndroid]);

    const onClickExportCSV = useCallback(async () => {
        const dt = selectedData.map((item: any) => ({
            ...item,
            sentiment: sentimentName[item.sentiment],
        }));
        const config = [
            {title: 'id', dataKey: 'id'},
            {title: _('Title'), dataKey: 'title'},
            {title: _('Description'), dataKey: 'description'},
            {title: _('Category'), dataKey: 'category.title'},
            {title: _('Sentiment'), dataKey: 'sentiment'},
            {title: _('Improvement'), dataKey: 'improvement'},
            {title: _('Location'), dataKey: 'location.coordinates'},
            {title: _('Boundary'), dataKey: 'boundary.coordinates'},
        ];
        const csv = jsonToCSV(dt, config);
        const fileName = `surveys_${Date.now()}.csv`;
        const path = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
        RNFetchBlob.fs.writeFile(path, csv, 'utf8').then(() => {
            if (Platform.OS === 'android') {
                RNFetchBlob.android.addCompleteDownload({
                    title: fileName,
                    description: 'Download complete!',
                    mime: 'text/csv',
                    path: path,
                    showNotification: true,
                });
            } else if (Platform.OS === 'ios') {
                RNFetchBlob.ios.previewDocument(path);
            }
        });
        Toast.show('Saved CSV in Downloads folder!');
        setIsOpenExport(false);
    }, [selectedData]);

    const handleClearFilters = useCallback(() => {
        setProjectFilterId(null);
        setCategoryFilterId(null);
    }, [setProjectFilterId, setCategoryFilterId]);

    return (
        <View style={styles.container}>
            <HomeHeader
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                onExportPress={toggleExportModal}
                projectFilterId={projectFilterId}
                setProjectFilterId={setProjectFilterId}
                categoryFilterId={categoryFilterId}
                // @ts-expect-error Unable to cast to type expected by dropdown component
                setCategoryFilterId={setCategoryFilterId}
            />
            {(projectFilterId || categoryFilterId) && (
                <TouchableOpacity
                    style={styles.clearLink}
                    onPress={handleClearFilters}>
                    <Text title="Clear filters" />
                </TouchableOpacity>
            )}
            <ViewShot ref={viewShotRef}>
                <FlatList
                    data={selectedData || []}
                    style={styles.surveyList}
                    contentContainerStyle={styles.surveyListContentContainer}
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
            </ViewShot>
            <ExportActions
                isOpenExport={isOpenExport}
                onBackdropPress={toggleExportModal}
                onClickExportImage={onClickExportImage}
                onClickExportCSV={onClickExportCSV}
            />
        </View>
    );
};

export default Surveys;
