import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {View, Image, Alert, PermissionsAndroid, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import {RootStateOrAny, useSelector} from 'react-redux';
import turfCentroid from '@turf/centroid';

import HomeHeader from 'components/HomeHeader';
import ExportActions from 'components/ExportActions';

import cs from '@rna/utils/cs';
import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';
import {jsonToCSV} from 'utils';
import {_} from 'services/i18n';
import sentimentName from 'utils/sentimentName';

import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';
import type {HappeningSurveyType} from '@generated/types';
import type {ProjectType} from '@generated/types';
import type {LocalCategoryType} from 'services/data/surveyCategory';

import styleJSON from 'assets/map/style.json';

import {Cluster} from './Cluster';
import {UserLocation} from './UserLocation';
import OfflineLayers from './OfflineLayers';
import styles from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface Props {
    showCluster?: boolean;
    hideHeader?: boolean;
    locationBarStyle?: object;
    surveyData?: HappeningSurveyType[];
    isStatic?: boolean;
    showUserLocation?: boolean;
    onSurveyEntryPress?: (survey: HappeningSurveyType) => void;
}

const mapViewStyles = JSON.stringify(styleJSON);

const Map: React.FC<Props> = ({
    showCluster = false,
    hideHeader = false,
    locationBarStyle,
    surveyData = [],
    isStatic = false,
    showUserLocation = false,
    onSurveyEntryPress,
}) => {
    const netInfo = useNetInfo();
    const route = useRoute<any>();

    const navigation = useNavigation<StackNavigationProp<StackParamList>>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const [isOffline, setIsOffline] = useState(true);

    const [isOpenExport, setIsOpenExport] = useState(false);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

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

    const [selectedTab, setSelectedTab] = useState('all');

    const selectedData = useMemo(() => {
        const filteredData = surveyData.filter((el: HappeningSurveyType) => {
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
        });
        return selectedTab === 'myentries'
            ? filteredData.filter(
                  (el: HappeningSurveyType) =>
                      el.createdBy?.id && el.createdBy?.id === user?.id,
              )
            : filteredData;
    }, [selectedTab, surveyData, user?.id, categoryFilterId, projectFilterId]);

    const manageOffline = useCallback(
        async packName => {
            try {
                const offlinePack = await MapboxGL.offlineManager.getPack(
                    packName,
                );
                if (!offlinePack) {
                    if (netInfo.isInternetReachable) {
                        setIsOffline(false);
                        return MapboxGL.offlineManager.createPack({
                            name: packName,
                            styleURL: 'mapbox://styles/mapbox/streets-v11',
                            minZoom: 0,
                            maxZoom: 10,
                            bounds: [
                                [156.4715, -1.5917],
                                [140.7927, -12.1031],
                            ],
                        });
                    }
                } else {
                    setIsOffline(false);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [netInfo],
    );

    const mapRef = useRef() as React.MutableRefObject<MapboxGL.MapView>;
    const viewShotRef = useRef<any>();
    const mapCameraRef = useRef() as React.MutableRefObject<MapboxGL.Camera>;
    const shapeSourceRef =
        useRef() as React.MutableRefObject<MapboxGL.ShapeSource>;

    const [currentLocation, setCurrentLocation] = useState<
        number[] | undefined
    >([147.17972, -9.44314]);

    const [mapCameraProps, setMapCameraProps] = useState<object | null>({});

    const handleLocationPress = useCallback(() => {
        if (
            isStatic &&
            selectedData?.length === 1 &&
            (selectedData[0].location || selectedData[0].boundary)
        ) {
            let coordinates = [];
            if (selectedData[0].location) {
                coordinates = selectedData[0].location.coordinates;
            } else if (selectedData[0].boundary) {
                coordinates = turfCentroid(selectedData[0].boundary)?.geometry
                    ?.coordinates;
            }
            if (coordinates?.length) {
                mapCameraRef.current.setCamera({
                    zoomLevel: 13,
                    animationDuration: 3000,
                    centerCoordinate: coordinates,
                });
            }
            return;
        }
        checkLocation().then(result => {
            if (result) {
                Geolocation.getCurrentPosition(
                    position => {
                        const coordinates = [
                            position.coords.longitude,
                            position.coords.latitude,
                        ];
                        mapCameraRef.current.setCamera({
                            zoomLevel: 13,
                            animationDuration: 3000,
                            centerCoordinate: coordinates,
                        });
                        setCurrentLocation(coordinates);
                    },
                    error => {
                        Alert.alert(`Code ${error.code}`, error.message);
                    },
                    {enableHighAccuracy: true, timeout: 15000},
                );
            }
        });
    }, [isStatic, selectedData]);

    const handleFinishMapLoad = useCallback(() => {
        manageOffline('png_14_20');
        handleLocationPress();
    }, [manageOffline, handleLocationPress]);

    useEffect(() => {
        if (netInfo.isInternetReachable) {
            setIsOffline(false);
        }
    }, [netInfo.isInternetReachable]);

    const onRegionDidChange = useCallback(() => {
        setMapCameraProps({});
    }, []);

    const handleSurveyPolyShapePress = useCallback(
        shape => {
            if (isStatic && !onSurveyEntryPress) {
                return;
            }
            if (shape?.features?.length === 1) {
                const feature = shape.features[0];
                if (feature?.properties?.surveyItem) {
                    if (onSurveyEntryPress) {
                        return onSurveyEntryPress(
                            feature.properties.surveyItem,
                        );
                    }
                    return navigation.navigate('SurveyItem', {
                        item: feature.properties.surveyItem,
                    });
                }
            } else if (shape?.features?.length > 1) {
                const feature = shape.features[shape.features.length - 1];
                if (feature?.properties?.surveyItem) {
                    if (onSurveyEntryPress) {
                        return onSurveyEntryPress(
                            feature.properties.surveyItem,
                        );
                    }
                    return navigation.navigate('SurveyItem', {
                        item: feature.properties.surveyItem,
                    });
                }
            }
        },
        [navigation, isStatic, onSurveyEntryPress],
    );

    const handleSurveyShapePress = useCallback(
        async shape => {
            if (isStatic && !onSurveyEntryPress) {
                return;
            }
            if (shape?.features?.[0]?.properties?.surveyItem) {
                const feature = shape.features[0];
                if (feature?.properties?.surveyItem) {
                    if (onSurveyEntryPress) {
                        return onSurveyEntryPress(
                            feature.properties.surveyItem,
                        );
                    }
                    return navigation.navigate('SurveyItem', {
                        item: feature.properties.surveyItem,
                    });
                }
            } else if (shape?.features?.[0]?.properties?.cluster) {
                try {
                    const feature = shape.features[0];
                    const currentZoom = await mapRef.current.getZoom();
                    if (currentZoom > 19 && feature?.properties?.surveyItem) {
                        if (onSurveyEntryPress) {
                            return onSurveyEntryPress(
                                feature.properties.surveyItem,
                            );
                        }
                        return navigation.navigate('SurveyItem', {
                            item: feature.properties.surveyItem,
                        });
                    }
                    const zoom =
                        await shapeSourceRef.current.getClusterExpansionZoom(
                            feature,
                        );
                    if (zoom) {
                        setMapCameraProps({
                            zoomLevel: zoom,
                            animationMode: 'flyTo',
                            animationDuration: 1000,
                            centerCoordinate: feature.geometry.coordinates,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        [navigation, isStatic, onSurveyEntryPress],
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

    return (
        <View style={styles.page}>
            {!hideHeader && (
                <HomeHeader
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    homeScreen
                    onExportPress={toggleExportModal}
                    projectFilterId={projectFilterId}
                    setProjectFilterId={setProjectFilterId}
                    categoryFilterId={categoryFilterId}
                    // @ts-expect-error Unable to cast to type expected by dropdown component
                    setCategoryFilterId={setCategoryFilterId}
                />
            )}
            <ViewShot ref={viewShotRef} style={styles.container}>
                <MapboxGL.MapView
                    ref={mapRef}
                    style={styles.map}
                    onRegionDidChange={onRegionDidChange}
                    onDidFinishLoadingStyle={handleFinishMapLoad}
                    styleJSON={isOffline ? mapViewStyles : ''}
                    compassViewMargins={{x: 20, y: hideHeader ? 20 : 170}}>
                    <MapboxGL.Camera
                        defaultSettings={{
                            centerCoordinate: currentLocation,
                            zoomLevel: 5,
                        }}
                        ref={mapCameraRef}
                        {...mapCameraProps}
                    />
                    {isOffline && <OfflineLayers />}
                    {showUserLocation && <UserLocation visible={true} />}
                    {showCluster && (
                        <Cluster
                            onPolygonPress={handleSurveyPolyShapePress}
                            onPointPress={handleSurveyShapePress}
                            shapeSourceRef={shapeSourceRef}
                            surveyData={selectedData}
                        />
                    )}
                </MapboxGL.MapView>
            </ViewShot>
            <View style={cs(styles.locationBar, locationBarStyle)}>
                <TouchableOpacity
                    style={styles.locationWrapper}
                    onPress={handleLocationPress}>
                    <Image
                        source={require('assets/images/locate.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <ExportActions
                isOpenExport={isOpenExport}
                onBackdropPress={toggleExportModal}
                onClickExportImage={onClickExportImage}
                onClickExportCSV={onClickExportCSV}
            />
        </View>
    );
};

export default Map;
