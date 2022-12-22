import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {View, Image, Alert, PermissionsAndroid, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNavigation} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import {RootStateOrAny, useSelector} from 'react-redux';

import HomeHeader from 'components/HomeHeader';
import ExportActions from 'components/ExportActions';

import cs from '@rna/utils/cs';
import surveyCategory from 'services/data/surveyCategory';
import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';
import {jsonToCSV} from 'utils';
import {_} from 'services/i18n';

import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';
import type {HappeningSurveyType} from '@generated/types';
import type {FeatureCollection, Geometry, GeoJsonProperties} from 'geojson';

import styleJSON from 'assets/map/style.json';
import markerIcon from 'assets/icons/markers.png';

import {UserLocation} from './UserLocation';
import OfflineLayers from './OfflineLayers';
import styles, {mapStyles} from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface Props {
    showCluster?: boolean;
    hideHeader?: boolean;
    locationBarStyle?: object;
    surveyData?: HappeningSurveyType[];
    isStatic?: boolean;
    onSurveyEntryPress?: (survey: HappeningSurveyType) => void;
}

const mapViewStyles = JSON.stringify(styleJSON);

const Map: React.FC<Props> = ({
    showCluster = false,
    hideHeader = false,
    locationBarStyle,
    surveyData = [],
    isStatic = false,
    onSurveyEntryPress,
}) => {
    const netInfo = useNetInfo();

    const navigation = useNavigation<StackNavigationProp<StackParamList>>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const [isOffline, setIsOffline] = useState(true);

    const [isOpenExport, setIsOpenExport] = useState(false);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

    const [selectedTab, setSelectedTab] = useState('all');

    const selectedData = useMemo(
        () =>
            selectedTab === 'myentries'
                ? surveyData.filter(
                      (el: HappeningSurveyType) =>
                          el.createdBy?.id && el.createdBy?.id === user?.id,
                  )
                : surveyData,
        [selectedTab, surveyData, user?.id],
    );

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
                coordinates =
                    selectedData[0].boundary.coordinates?.[0]?.[0]?.[0];
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

    const renderCluster = useCallback(() => {
        const shape =
            selectedData
                .filter((survey: HappeningSurveyType) => survey.location)
                .map((survey: HappeningSurveyType) => ({
                    type: 'Feature',
                    properties: {
                        surveyItem: survey,
                    },
                    geometry: {
                        type: survey.location?.type,
                        coordinates: survey.location?.coordinates,
                    },
                })) || [];

        let surveyGeoJSON = {
            type: 'FeatureCollection',
            features: [...shape],
        };
        const polyShape =
            selectedData
                .filter((survey: HappeningSurveyType) => survey.boundary)
                .map((survey: HappeningSurveyType) => ({
                    type: 'Feature',
                    properties: {
                        surveyItem: survey,
                        title: survey.title,
                    },
                    geometry: survey.boundary,
                })) || [];

        let surveyPolyGeoJSON = {
            type: 'FeatureCollection',
            features: [...polyShape],
        };

        let icons = surveyCategory
            .map(category =>
                category.childs.map(child => ({[child.id]: child.icon})),
            )
            .flat();
        let categoryIcons = Object.assign({marker: markerIcon}, ...icons);

        if (!shape) {
            return;
        }

        return (
            <>
                <MapboxGL.Images images={categoryIcons} />
                <MapboxGL.ShapeSource
                    id="surveyPolySource"
                    onPress={handleSurveyPolyShapePress}
                    shape={
                        surveyPolyGeoJSON as FeatureCollection<
                            Geometry,
                            GeoJsonProperties
                        >
                    }>
                    <MapboxGL.SymbolLayer
                        id="polyTitle"
                        style={mapStyles.polyTitle}
                        belowLayerID="singlePoint"
                    />
                    <MapboxGL.FillLayer
                        id="polygon"
                        sourceLayerID="surveyPolySource"
                        belowLayerID="polyTitle"
                        style={mapStyles.polygon}
                    />
                </MapboxGL.ShapeSource>
                <MapboxGL.ShapeSource
                    ref={shapeSourceRef}
                    id="surveySource"
                    cluster
                    onPress={handleSurveyShapePress}
                    shape={
                        surveyGeoJSON as FeatureCollection<
                            Geometry,
                            GeoJsonProperties
                        >
                    }>
                    <MapboxGL.SymbolLayer
                        id="pointCount"
                        style={mapStyles.pointCount}
                        filter={['has', 'point_count']}
                    />
                    <MapboxGL.CircleLayer
                        id="circles"
                        style={mapStyles.clusterPoints}
                        filter={['has', 'point_count']}
                        belowLayerID="pointCount"
                    />
                    <MapboxGL.SymbolLayer
                        id="singlePoint"
                        style={mapStyles.singlePoint}
                        filter={['!', ['has', 'point_count']]}
                        belowLayerID="circles"
                    />
                    <MapboxGL.SymbolLayer
                        id="iconBackground"
                        style={mapStyles.marker}
                        filter={['!', ['has', 'point_count']]}
                        belowLayerID="singlePoint"
                    />
                </MapboxGL.ShapeSource>
            </>
        );
    }, [selectedData, handleSurveyShapePress, handleSurveyPolyShapePress]);

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
        const csv = jsonToCSV(selectedData, config);
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
                    <UserLocation visible={true} />
                    {showCluster && renderCluster()}
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
