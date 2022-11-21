import React, {useEffect, useCallback, useState, useRef, useMemo} from 'react';
import {
    View,
    Image,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useMutation} from '@apollo/client';
import {
    useNavigation,
    useRoute,
    useFocusEffect,
} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import {RootStateOrAny, useSelector} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import {Icon} from 'react-native-eva-icons';
import {differenceInDays, formatDistanceToNowStrict, format} from 'date-fns';

import Button from 'components/Button';
import Text from 'components/Text';
import {Loader} from 'components/Loader';
import {OptionIcon} from 'components/HeaderButton';
import ProjectInput from 'components/ProjectInput';
import SurveyActions from 'components/SurveyActions';
import SurveyReview from 'components/SurveyReview';
import ExportActions from 'components/ExportActions';

import {jsonToCSV} from 'utils';
import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';
import {
    DELETE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY_HISTORY,
    GET_HAPPENING_SURVEY_HISTORY_ITEM,
} from 'services/gql/queries';
import {UPDATE_NUM_DAYS} from 'utils/config';

import useCategoryIcon from 'hooks/useCategoryIcon';
import useQuery from 'hooks/useQuery';

import type {
    HappeningSurveyType,
    HappeningSurveyHistoryType,
    DeleteHappeningSurveyMutation,
    DeleteHappeningSurveyMutationVariables,
} from '@generated/types';

import {getErrorMessage} from 'utils/error';

import cs from '@rna/utils/cs';

import HistoryTabs from './HistoryTabs';
import styles from './styles';

const Header = ({title}: {title: string}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle} title={title} />
        </View>
    );
};

const Photos = ({photos}: {photos: {media: string}[]}) => {
    const renderItem = useCallback(
        ({item}: {item: {media: string}}) => (
            <Image
                source={
                    {uri: item.media} ||
                    require('assets/images/category-placeholder.png')
                }
                style={styles.surveyImage}
            />
        ),
        [],
    );
    return (
        <FlatList
            data={photos}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const SurveyItem = () => {
    const netInfo = useNetInfo();

    const viewShotRef = useRef<any>();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const {data, refetch} = useQuery<{
        happeningSurveysHistory: HappeningSurveyHistoryType[];
    }>(GET_HAPPENING_SURVEY_HISTORY, {
        variables: {surveyId: route?.params?.item?.id},
    });
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const [activeVersionId, setActiveVersionId] = useState<string | number>(
        'current',
    );

    const {
        loading,
        data: historyItemData,
        refetch: fetchHistoryItem,
    } = useQuery<{
        happeningSurveysHistory: HappeningSurveyHistoryType[];
    }>(GET_HAPPENING_SURVEY_HISTORY_ITEM, {}, true);

    const handleChangeVersion = useCallback(
        tabItem => {
            if (tabItem.id !== 'current') {
                fetchHistoryItem({
                    variables: {
                        surveyId: route?.params?.item
                            ? route.params.item.id
                            : null,
                        id: Number(tabItem.id),
                    },
                });
            }
            setActiveVersionId(tabItem.id);
        },
        [fetchHistoryItem, route],
    );

    const versionsData = useMemo(() => {
        if (data?.happeningSurveysHistory) {
            const historyData = data.happeningSurveysHistory.filter(
                hss => hss?.serializedData?.fields?.modifiedAt,
            );
            if (historyData.length > 1) {
                return historyData.map((hd, idx) => {
                    if (idx === 0) {
                        return {id: 'current', title: _('Current')};
                    }
                    const dateObj = new Date(
                        hd?.serializedData?.fields?.modifiedAt,
                    );
                    return {
                        id: hd.id,
                        title: format(dateObj, 'MMM d'),
                    };
                });
            }
        }
        return [];
    }, [data]);

    const [isOpenActions, setIsOpenActions] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenExport, setIsOpenExport] = useState(false);

    const surveyData = useMemo(() => {
        if (activeVersionId !== 'current') {
            return {
                ...(historyItemData?.happeningSurveysHistory?.[0]
                    ?.serializedData?.fields || {}),
                id: route?.params?.item?.id,
            };
        }
        return route?.params?.item;
    }, [route, historyItemData, activeVersionId]);

    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(surveyData?.category?.id),
    );

    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    const isOwnerUser = useMemo(() => {
        return (
            route?.params?.item?.createdBy &&
            route.params.item.createdBy?.id === user?.id
        );
    }, [route, user]);

    const [showUpdate, differenceFromPreviousUpdate, lastUpdated] =
        useMemo(() => {
            if (route?.params?.item) {
                const modifiedDate = new Date(route.params.item.modifiedAt);
                const dateDifference = differenceInDays(
                    modifiedDate,
                    new Date(),
                );
                const formattedDate = format(modifiedDate, 'MMM dd, yyyy');
                if (dateDifference < -UPDATE_NUM_DAYS) {
                    return [
                        true,
                        formatDistanceToNowStrict(modifiedDate, {
                            roundingMethod: 'floor',
                        }),
                        formattedDate,
                    ];
                }
                return [false, null, formattedDate];
            }
            return [false, null, 'N/A'];
        }, [route]);

    const [deleteHappeningSurvey] = useMutation<
        DeleteHappeningSurveyMutation,
        DeleteHappeningSurveyMutationVariables
    >(DELETE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show('Happening survey deleted successfully !');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log('Delete happening survey', err);
        },
    });

    const toggleOpenActions = useCallback(() => {
        setIsOpenActions(!isOpenActions);
        setIsOpenDelete(false);
    }, [isOpenActions]);

    const toggleEditPress = useCallback(() => {
        setIsOpenActions(false);
        navigation.navigate('EditSurvey', {surveyItem: surveyData});
    }, [navigation, surveyData]);

    const handleUpdatePress = useCallback(() => {
        navigation.navigate('UpdateSurvey', {surveyItem: surveyData});
    }, [navigation, surveyData]);

    const toggleDeleteModal = useCallback(() => {
        setIsOpenDelete(true);
    }, []);

    const toggleActionsModal = useCallback(() => {
        setIsOpenActions(false);
    }, []);

    const toggleConfirmDelete = useCallback(async () => {
        setIsOpenActions(false);
        await deleteHappeningSurvey({
            variables: {
                id: surveyData.id,
            },
            optimisticResponse: {
                deleteHappeningSurvey: {
                    __typename: 'DeleteHappeningSurvey',
                    ok: true,
                    errors: null,
                },
            },
            update: async cache => {
                try {
                    const readData: any =
                        cache.readQuery({
                            query: GET_HAPPENING_SURVEY,
                        }) || [];
                    let happeningSurveys = readData?.happeningSurveys.filter(
                        (obj: HappeningSurveyType) => {
                            return obj.id !== surveyData.id;
                        },
                    );
                    await cache.writeQuery({
                        query: GET_HAPPENING_SURVEY,
                        data: {
                            happeningSurveys: happeningSurveys,
                        },
                    });
                    navigation.navigate('Feed');
                } catch (e) {
                    console.log('Error on deleting happening survey !!!', e);
                }
            },
        });
    }, [deleteHappeningSurvey, navigation, surveyData?.id]);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

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
        const csv = jsonToCSV([surveyData], config);
        const path = `${
            RNFetchBlob.fs.dirs.DownloadDir
        }/survey_${Date.now()}.csv`;
        RNFetchBlob.fs.writeFile(path, csv, 'utf8');
        Toast.show('Saved CSV in Downloads folder!');
        setIsOpenExport(false);
    }, [surveyData]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.rightBar}>
                    <TouchableOpacity
                        onPress={toggleExportModal}
                        style={cs(!isOwnerUser && styles.rightMargin)}>
                        <Image
                            source={require('assets/images/export.png')}
                            style={styles.exportIcon}
                        />
                    </TouchableOpacity>
                    {isOwnerUser ? (
                        <OptionIcon onOptionPress={toggleOpenActions} />
                    ) : null}
                </View>
            ),
            headerTitle: isOwnerUser ? _('My entry') : _('Public entry'),
        });
    }, [
        navigation,
        surveyData,
        isOwnerUser,
        toggleOpenActions,
        toggleExportModal,
    ]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={
                versionsData.length > 1 ? (showUpdate ? [1] : [0]) : []
            }>
            {showUpdate && (
                <View style={styles.updateMessage}>
                    <Text
                        style={styles.updateMessageText}
                        title={_(
                            `This entry is ${differenceFromPreviousUpdate} old. Let us know if there are any updates.`,
                        )}
                    />
                    <Button
                        icon="edit-2-outline"
                        light
                        title={_('Update')}
                        style={styles.updateButton}
                        textStyle={styles.updateButtonText}
                        onPress={handleUpdatePress}
                    />
                </View>
            )}
            {versionsData.length > 1 && netInfo.isInternetReachable && (
                <HistoryTabs
                    style={styles.versionTabsContainer}
                    tabsData={versionsData}
                    onChangeTab={handleChangeVersion}
                    activeTabId={activeVersionId}
                />
            )}
            {loading ? (
                <Loader loading style={styles.loader} />
            ) : surveyData.title ? (
                <ViewShot ref={viewShotRef} style={styles.container}>
                    <View style={styles.category}>
                        <Image
                            source={
                                categoryIcon ||
                                require('assets/images/category-placeholder.png')
                            }
                            style={styles.categoryIcon}
                        />
                        <Text
                            style={styles.field}
                            title={_(surveyData?.category?.title)}
                        />
                        {surveyData?.isOffline && (
                            <View style={styles.offlineIndicator}>
                                <Icon
                                    name="wifi-off-outline"
                                    height={14}
                                    width={14}
                                    fill="#fff"
                                />
                            </View>
                        )}
                    </View>
                    {surveyData.project && (
                        <ProjectInput
                            activeProject={surveyData.project}
                            style={styles.project}
                            disabled
                        />
                    )}
                    <View style={styles.lastUpdate}>
                        <Text
                            style={styles.lastUpdateText}
                            title="Last updated"
                        />
                        <Text
                            style={styles.lastUpdateDate}
                            title={lastUpdated}
                        />
                    </View>
                    <Header title={_('Name')} />
                    <View style={styles.content}>
                        <Text style={styles.name} title={surveyData?.title} />
                    </View>
                    <Header title={_('Photos')} />
                    <View style={styles.photosWrapper}>
                        <Photos
                            photos={
                                surveyData?.attachment
                                    ? [...surveyData.attachment].reverse()
                                    : []
                            }
                        />
                    </View>
                    {surveyData?.sentiment.length > 0 && (
                        <>
                            <Header title={_('Feels')} />
                            <View style={styles.content}>
                                <View style={styles.feelWrapper}>
                                    <Text
                                        style={styles.feelIcon}
                                        title={surveyData?.sentiment}
                                    />
                                </View>
                            </View>
                        </>
                    )}
                    {surveyData?.improvement && (
                        <>
                            <Header title={_('Improvement')} />
                            <View style={styles.content}>
                                <SurveyReview
                                    name={surveyData.improvement}
                                    reviewItem={true}
                                />
                            </View>
                        </>
                    )}
                    <Header title={_('Description')} />
                    <View style={styles.content}>
                        <Text
                            style={styles.description}
                            title={surveyData?.description}
                        />
                    </View>
                    <Header title={_('Published Anonymously')} />
                    <View style={styles.content}>
                        <Text
                            style={styles.description}
                            title={surveyData?.createdBy ? _('No') : _('Yes')}
                        />
                    </View>
                    <Header title={_('Public Information')} />
                    <View style={styles.content}>
                        <Text
                            style={styles.description}
                            title={surveyData?.isPublic ? _('Yes') : _('No')}
                        />
                    </View>
                    <Header title={_('Test Data')} />
                    <View style={styles.content}>
                        <Text
                            style={styles.description}
                            title={surveyData?.isTest ? _('Yes') : _('No')}
                        />
                    </View>
                    <SurveyActions
                        isOpenActions={isOpenActions}
                        onEditPress={toggleEditPress}
                        onDeletePress={toggleDeleteModal}
                        onBackdropPress={toggleActionsModal}
                        isConfirmDeleteOpen={isOpenDelete}
                        toggleCancelDelete={toggleActionsModal}
                        toggleConfirmDelete={toggleConfirmDelete}
                    />
                    <ExportActions
                        isOpenExport={isOpenExport}
                        onBackdropPress={toggleExportModal}
                        onClickExportImage={onClickExportImage}
                        onClickExportCSV={onClickExportCSV}
                    />
                </ViewShot>
            ) : (
                <Text
                    style={styles.emptyText}
                    title={_('Unable to get survey data!')}
                />
            )}
        </ScrollView>
    );
};

export default SurveyItem;
