import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, Image, Text} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNetInfo} from '@react-native-community/netinfo';

import HomeHeader from 'components/HomeHeader';

import cs from '@rna/utils/cs';
import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';
import COLORS from 'utils/colors';

import styleJSON from 'assets/map/style.json';

import OfflineLayers from './OfflineLayers';
import DrawPolygonIcon from './Icon/DrawPolygon';
import MarkerIcon from './Icon/Marker';
import styles from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface locationRefType {
    state?: {
        [coordinates: string]: Array<number>;
    };
}

interface Props {
    hideHeader?: boolean;
    showMarker?: boolean;
    locationBarStyle?: object;
    onLocationPick?: (location: number[] | number[][] | undefined) => void;
    pickLocation?: string;
}

const mapViewStyles = JSON.stringify(styleJSON);

const Map: React.FC<Props> = ({
    hideHeader = false,
    showMarker = false,
    locationBarStyle,
    onLocationPick,
    pickLocation = null,
}) => {
    const netInfo = useNetInfo();

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
                        await MapboxGL.offlineManager.createPack({
                            name: packName,
                            styleURL: 'mapbox://styles/mapbox/streets-v11',
                            minZoom: 14,
                            maxZoom: 20,
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

    useEffect(() => {
        manageOffline('png_14_20');
    }, [manageOffline]);

    const locationRef = useRef<locationRefType | null>();

    const [currentLocation, setCurrentLocation] = useState<
        number[] | undefined
    >([147.17972, -9.44314]);

    const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
    const [mapCameraProps, setMapCameraProps] = useState<object | null>({});
    const [polygonPoint, setPolygonPoint] = useState<number[][]>([]);

    const handlePress = useCallback(() => {
        checkLocation().then(result => {
            if (result) {
                setMapCameraProps(mcProps => ({
                    zoomLevel: 12,
                    animationMode: 'flyTo',
                    animationDuration: 6000,
                    centerCoordinate: locationRef.current?.state?.coordinates,
                }));
                setCurrentLocation(locationRef.current?.state?.coordinates);
            }
        });
    }, []);

    useEffect(() => {
        switch (pickLocation) {
            case 'Use my current location':
                setDrawPolygon(false);
                setPolygonPoint([]);
                handlePress();
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
    }, [pickLocation, currentLocation, handlePress, onLocationPick]);

    const onRegionDidChange = useCallback(value => {
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
                    polygonPoint.map((value, index) => (
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
            if (pickLocation) {
                setCurrentLocation(mapEvent.geometry.coordinates);
                if (drawPolygon) {
                    setPolygonPoint([
                        ...polygonPoint,
                        mapEvent.geometry.coordinates,
                    ]);
                    onLocationPick &&
                        onLocationPick?.([
                            ...polygonPoint,
                            mapEvent.geometry.coordinates,
                        ]);
                }
            }
        },
        [polygonPoint, drawPolygon, pickLocation, onLocationPick],
    );

    const handleDrawTool = useCallback(() => {
        setDrawPolygon(!drawPolygon);
    }, [drawPolygon]);

    return (
        <View style={styles.page}>
            {!hideHeader && <HomeHeader />}
            <View style={styles.container}>
                <MapboxGL.MapView
                    style={styles.map}
                    onRegionDidChange={onRegionDidChange}
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
                    <MapboxGL.UserLocation
                        visible={true}
                        showUserLocation={true}
                        ref={locationRef}
                    />
                    {showMarker && renderAnnotation()}
                    {pickLocation === 'Draw polygon' && renderPolygon()}
                </MapboxGL.MapView>
            </View>
            <View style={cs(styles.locationBar, locationBarStyle)}>
                <TouchableOpacity
                    style={styles.locationWrapper}
                    onPress={handlePress}>
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
