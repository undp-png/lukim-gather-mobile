import React, {useRef, useCallback, useState, useMemo} from 'react';
import {
    RefreshControl,
    View,
    ListRenderItem,
    FlatList,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';

import SurveyItem from 'components/SurveyItem';
import EmptyListMessage from 'components/EmptyListMessage';
import ExportActions from 'components/ExportActions';

import useQuery from 'hooks/useQuery';

import {jsonToCSV} from 'utils';
import {_} from 'services/i18n';
import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import {HappeningSurveyType} from '@generated/types';

import styles from './styles';
import HomeHeader from 'components/HomeHeader';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const Surveys = () => {
    const viewShotRef = useRef<any>();
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
        const config = [{title: _('Title'), dataKey: 'title'}];
        const csv = jsonToCSV(selectedData, config);
        const path = `${
            RNFetchBlob.fs.dirs.DownloadDir
        }/surveys_${Date.now()}.csv`;
        RNFetchBlob.fs.writeFile(path, csv, 'utf8');
        Toast.show('Saved CSV in Downloads folder!');
        setIsOpenExport(false);
    }, [selectedData]);

    return (
        <View style={styles.container}>
            <HomeHeader
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                onExportPress={toggleExportModal}
            />
            <ViewShot ref={viewShotRef}>
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
