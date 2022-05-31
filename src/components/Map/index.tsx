import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, Image, Alert} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';

import HomeHeader from 'components/HomeHeader';

import cs from '@rna/utils/cs';
import surveyCategory from 'services/data/surveyCategory';
import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';
import COLORS from 'utils/colors';

import useQuery from 'hooks/useQuery';

import {HappeningSurveyType} from '@generated/types';

import styleJSON from 'assets/map/style.json';

import {UserLocation} from './UserLocation';
import OfflineLayers from './OfflineLayers';
import DrawPolygonIcon from './Icon/DrawPolygon';
import MarkerIcon from './Icon/Marker';
import styles, {mapStyles} from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface Props {
    showCluster?: boolean;
    hideHeader?: boolean;
    showMarker?: boolean;
    locationBarStyle?: object;
    onLocationPick?: (location: number[] | number[][] | undefined) => void;
    pickLocation?: string;
}

const mapViewStyles = JSON.stringify(styleJSON);

const Map: React.FC<Props> = ({
    showCluster = false,
    hideHeader = false,
    showMarker = false,
    locationBarStyle,
    onLocationPick,
    pickLocation = null,
}) => {
    const netInfo = useNetInfo();

    const navigation = useNavigation();

    const [isOffline, setIsOffline] = useState(true);

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
                            minZoom: 10,
                            maxZoom: 14,
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

    const handleFinishMapLoad = useCallback(() => {
        manageOffline('png_14_20');
    }, [manageOffline]);

    const mapRef = useRef() as React.MutableRefObject<MapboxGL.MapView>;
    const shapeSourceRef =
        useRef() as React.MutableRefObject<MapboxGL.ShapeSource>;

    const [currentLocation, setCurrentLocation] = useState<
        number[] | undefined
    >([147.17972, -9.44314]);

    const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
    const [mapCameraProps, setMapCameraProps] = useState<object | null>({});
    const [polygonPoint, setPolygonPoint] = useState<number[][]>([]);

    const handleLocationPress = useCallback(() => {
        checkLocation().then(result => {
            if (result) {
                Geolocation.getCurrentPosition(
                    position => {
                        const coordinates = [
                            position.coords.longitude,
                            position.coords.latitude,
                        ];
                        setMapCameraProps({
                            zoomLevel: 12,
                            animationMode: 'flyTo',
                            animationDuration: 6000,
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
    }, []);

    useEffect(() => {
        handleLocationPress();
    }, [handleLocationPress]);

    useEffect(() => {
        if (netInfo.isInternetReachable) {
            setIsOffline(false);
        }
    }, [netInfo]);

    useEffect(() => {
        switch (pickLocation) {
            case 'Use my current location':
                setDrawPolygon(false);
                setPolygonPoint([]);
                handleLocationPress();
                onLocationPick && onLocationPick?.(currentLocation);
                break;
            case 'Set on a map':
                setDrawPolygon(false);
                setPolygonPoint([]);
                onLocationPick && onLocationPick?.(currentLocation);
                break;
            case 'Draw polygon':
                break;
            default:
                setDrawPolygon(false);
                setPolygonPoint([]);
        }
    }, [pickLocation, currentLocation, handleLocationPress, onLocationPick]);

    const onRegionDidChange = useCallback(() => {
        setMapCameraProps({});
    }, []);

    const renderAnnotation = useCallback(() => {
        return (
            <MapboxGL.PointAnnotation id="marker" coordinate={currentLocation}>
                <View style={styles.markerContainer}>
                    <MarkerIcon />
                    <View style={styles.markerLine} />
                    <View style={styles.markerDotOuter}>
                        <View style={styles.markerDotInner} />
                    </View>
                </View>
            </MapboxGL.PointAnnotation>
        );
    }, [currentLocation]);

    const {data, refetch} = useQuery(GET_HAPPENING_SURVEY);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const handleSurveyPolyShapePress = useCallback(
        shape => {
            if (shape?.features?.length === 1) {
                const feature = shape.features[0];
                if (feature?.properties?.surveyItem) {
                    return navigation.navigate('SurveyItem', {
                        item: feature.properties.surveyItem,
                    });
                }
            } else if (shape?.features?.length > 1) {
                const feature = shape.features[shape.features.length - 1];
                if (feature?.properties?.surveyItem) {
                    return navigation.navigate('SurveyItem', {
                        item: feature.properties.surveyItem,
                    });
                }
            }
        },
        [navigation],
    );

    const handleSurveyShapePress = useCallback(
        async shape => {
            if (shape?.features?.length === 1) {
                const feature = shape.features[0];
                if (feature?.properties?.surveyItem) {
                    return navigation.navigate('SurveyItem', {
                        item: feature.properties.surveyItem,
                    });
                }
            } else if (shape?.features?.length > 1) {
                try {
                    const feature = shape.features[0];
                    const currentZoom = await mapRef.current.getZoom();
                    if (currentZoom > 19 && feature?.properties?.surveyItem) {
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
        [navigation],
    );

    const renderCluster = useCallback(() => {
        const shape =
            data?.happeningSurveys
                .filter((survey: HappeningSurveyType) => survey.location)
                .map((survey: HappeningSurveyType) => ({
                    type: 'Feature',
                    properties: {
                        surveyItem: survey,
                    },
                    geometry: {
                        type: survey.location.type,
                        coordinates: survey.location.coordinates,
                    },
                })) || [];

        let surveyGeoJSON = {
            type: 'FeatureCollection',
            features: [...shape],
        };
        const polyShape =
            data?.happeningSurveys
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
        let categoryIcons = Object.assign({}, ...icons);

        if (!shape) {
            return;
        }

        return (
            <>
                <MapboxGL.Images images={categoryIcons} />
                <MapboxGL.ShapeSource
                    id="surveyPolySource"
                    onPress={handleSurveyPolyShapePress}
                    shape={surveyPolyGeoJSON}>
                    <MapboxGL.SymbolLayer
                        id="polyTitle"
                        style={mapStyles.polyTitle}
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
                    shape={surveyGeoJSON}>
                    <MapboxGL.SymbolLayer
                        id="pointCount"
                        style={mapStyles.pointCount}
                        filter={['has', 'point_count']}
                    />
                    <MapboxGL.CircleLayer
                        id="circles"
                        belowLayerID="pointCount"
                        style={mapStyles.clusterPoints}
                        filter={['has', 'point_count']}
                    />
                    <MapboxGL.SymbolLayer
                        id="singlePoint"
                        style={mapStyles.singlePoint}
                        filter={['!', ['has', 'point_count']]}
                    />
                </MapboxGL.ShapeSource>
            </>
        );
    }, [data, handleSurveyShapePress, handleSurveyPolyShapePress]);

    const renderPolygon = useCallback(() => {
        const polygonGeoJSON = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [...polygonPoint],
            },
        };
        return (
            <MapboxGL.ShapeSource id="polygonSource" shape={polygonGeoJSON}>
                <MapboxGL.FillLayer
                    id="polygonFill"
                    style={styles.polygonFill}
                />
                {polygonPoint &&
                    polygonPoint.map((_, index) => (
                        <MapboxGL.CircleLayer
                            key={index}
                            id={'point-' + index}
                            style={styles.pointCircle}
                        />
                    ))}
            </MapboxGL.ShapeSource>
        );
    }, [polygonPoint]);

    const handleRemovePolygon = useCallback(() => {
        setPolygonPoint([]);
    }, []);

    const handleMapPress = useCallback(
        mapEvent => {
            switch (pickLocation) {
                case 'Set on a map':
                    setCurrentLocation(mapEvent.geometry.coordinates);
                    break;
                case 'Draw polygon':
                    setPolygonPoint([
                        ...polygonPoint,
                        mapEvent.geometry.coordinates,
                    ]);
                    onLocationPick &&
                        onLocationPick?.([
                            ...polygonPoint,
                            mapEvent.geometry.coordinates,
                        ]);
                    break;
                default:
                    break;
            }
        },
        [polygonPoint, pickLocation, onLocationPick],
    );

    const handleDrawTool = useCallback(() => {
        setDrawPolygon(!drawPolygon);
    }, [drawPolygon]);

    return (
        <View style={styles.page}>
            {!hideHeader && <HomeHeader />}
            <View style={styles.container}>
                <MapboxGL.MapView
                    ref={mapRef}
                    style={styles.map}
                    onRegionDidChange={onRegionDidChange}
                    onDidFinishLoadingStyle={handleFinishMapLoad}
                    styleJSON={isOffline ? mapViewStyles : ''}
                    compassViewMargins={{x: 30, y: 150}}
                    onPress={handleMapPress}>
                    <MapboxGL.Camera
                        defaultSettings={{
                            centerCoordinate: currentLocation,
                            zoomLevel: 5,
                        }}
                        {...mapCameraProps}
                    />
                    {isOffline && <OfflineLayers />}
                    <UserLocation visible={true} />
                    {showMarker && renderAnnotation()}
                    {pickLocation === 'Draw polygon' && renderPolygon()}
                    {showCluster && renderCluster()}
                </MapboxGL.MapView>
            </View>
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
            {pickLocation === 'Draw polygon' && (
                <View style={cs(styles.drawPolygon, locationBarStyle)}>
                    <TouchableOpacity
                        style={styles.locationWrapper}
                        onPress={handleDrawTool}>
                        <DrawPolygonIcon active={drawPolygon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.locationWrapper}
                        onPress={handleRemovePolygon}>
                        <Icon
                            name="trash-2-outline"
                            fill={COLORS.blueText}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Map;
