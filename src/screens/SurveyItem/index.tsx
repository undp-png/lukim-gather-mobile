import React, {useEffect, useCallback, useState, useRef, useMemo} from 'react';
import {
    View,
    Image,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
    Linking,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useMutation} from '@apollo/client';
import {
    useNavigation,
    useRoute,
    useFocusEffect,
} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import {RootStateOrAny, useSelector} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';
import {Icon} from 'react-native-eva-icons';
import {differenceInDays, formatDistanceToNowStrict, format} from 'date-fns';
import Clipboard from '@react-native-clipboard/clipboard';

import Button from 'components/Button';
import Text from 'components/Text';
import ImageView from 'components/ImageView';
import {Loader} from 'components/Loader';
import {OptionIcon} from 'components/HeaderButton';
import ProjectInput from 'components/ProjectInput';
import SurveyActions from 'components/SurveyActions';
import SurveyReview from 'components/SurveyReview';
import ExportActions from 'components/ExportActions';
import {Audio} from 'components/AudioPicker';
import Map from 'components/Map';

import {jsonToCSV} from 'utils';
import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';
import {
    DELETE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY_COMMENTS,
    GET_HAPPENING_SURVEY_HISTORY,
    GET_HAPPENING_SURVEY_HISTORY_ITEM,
} from 'services/gql/queries';
import {UPDATE_NUM_DAYS} from 'utils/config';
import Toast from 'utils/toast';

import {WEBSITE_HOST_URL} from '@env';

import useCategoryIcon from 'hooks/useCategoryIcon';
import useQuery from 'hooks/useQuery';

import type {
    CommentType,
    HappeningSurveyType,
    HappeningSurveyHistoryType,
    DeleteHappeningSurveyMutation,
    DeleteHappeningSurveyMutationVariables,
} from '@generated/types';

import {getErrorMessage} from 'utils/error';
import sentimentName from 'utils/sentimentName';

import cs from '@rna/utils/cs';

import Comment from './Comment';
import HistoryTabs from './HistoryTabs';
import styles from './styles';

const Header = ({title}: {title: string}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle} title={title} />
        </View>
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
    const {data: surveyDataComment, refetch: fetchComment} = useQuery<{
        comments: CommentType[];
    }>(GET_HAPPENING_SURVEY_COMMENTS, {
        variables: {surveyId: route?.params?.item?.id, level: 0},
    });
    useFocusEffect(
        useCallback(() => {
            refetch();
            fetchComment();
        }, [refetch, fetchComment]),
    );

    const [activeVersionId, setActiveVersionId] = useState<string | number>(
        'latest',
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
            if (tabItem.id !== 'latest') {
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
                        return {id: 'latest', title: _('Latest')};
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
        if (activeVersionId !== 'latest') {
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
            Toast.show('Happening survey deleted successfully!');
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
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
                    navigation.navigate('Feed', {screen: 'Home'});
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
            Toast.error(_('Permission required'));
        } catch (err) {
            console.log('Error' + err);
        }
    }, []);

    const onClickExportImage = useCallback(async () => {
        try {
            await viewShotRef.current.capture().then(async (uri: any) => {
                console.log(uri);
                if (Platform.OS === 'android') {
                    const granted = getPermissionAndroid();
                    if (!granted) {
                        return;
                    }
                }
                const newURI = await CameraRoll.save(uri, {
                    type: 'photo',
                    album: 'Lukim Gather',
                });
                Linking.openURL(newURI);
                Toast.show(_('Saved image in gallery!'));
                return setIsOpenExport(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, [getPermissionAndroid]);

    const onClickExportCSV = useCallback(async () => {
        const dt = {
            ...surveyData,
            sentiment: sentimentName[surveyData.sentiment],
        };
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
        const csv = jsonToCSV([dt], config);
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
    }, [surveyData]);

    const handleCopySurveyLink = useCallback(() => {
        if (!surveyData?.id) {
            return Toast.error(
                _('Error!'),
                _('An error occured getting the survey link!'),
            );
        }
        try {
            const hostUrl = WEBSITE_HOST_URL
                ? WEBSITE_HOST_URL
                : __DEV__
                ? 'https://staging.lukimgather.org'
                : 'https://lukimgather.org';
            const surveyLink = `${hostUrl}/public/survey/${surveyData.id}/`;
            Clipboard.setString(surveyLink);
            Toast.show(_('Link copied to clipboard!'));
            setIsOpenExport(false);
        } catch (err) {
            console.log(err);
            Toast.error(_('Error!'), getErrorMessage(err), {position: 'top'});
        }
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
                        <ImageView
                            images={
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
                    <Header title={_('Location')} />
                    <View style={styles.content}>
                        <View style={styles.mapContainer}>
                            <Map
                                hideHeader
                                isStatic
                                surveyData={[surveyData]}
                                showCluster
                                locationBarStyle={styles.locationBar}
                            />
                        </View>
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
                    {surveyData?.audioFile && (
                        <>
                            <Header title={_('Audio')} />
                            <View style={styles.content}>
                                <Audio audio={surveyData?.audioFile} isStatic />
                            </View>
                        </>
                    )}
                    {activeVersionId === 'latest' ? (
                        <View>
                            <Header title={_('Comments')} />
                            <View style={styles.content}>
                                <Comment
                                    surveyId={route?.params?.item?.id}
                                    commentItem={surveyDataComment?.comments}
                                    refetch={fetchComment}
                                />
                            </View>
                        </View>
                    ) : null}
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
                        onCopyLink={handleCopySurveyLink}
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
