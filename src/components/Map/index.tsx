import React, {useCallback, useState, useRef} from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';

import HomeHeader from 'components/HomeHeader';

import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';

import styles from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
    const locationRef = useRef(null);
    const [currentLocation, setCurrentLocation] = useState([
        147.17972, -9.44314,
    ]);
    const [mapCameraProps, setMapCameraProps] = useState<object | null>({});
    const handlePress = useCallback(() => {
        checkLocation().then(result => {
            if (result) {
                setMapCameraProps(mapCameraProps => ({
                    zoomLevel: 12,
                    animationMode: 'flyTo',
                    animationDuration: 6000,
                    centerCoordinate: locationRef.current.state.coordinates,
                }));
            }
        });
    }, []);
    const onRegionDidChange = useCallback(value => {
        setMapCameraProps({});
    }, []);
    return (
        <View style={styles.page}>
            <HomeHeader />
            <View style={styles.container}>
                <MapboxGL.MapView
                    style={styles.map}
                    onRegionDidChange={value => onRegionDidChange(value)}>
                    <MapboxGL.Camera
                        defaultSettings={{
                            centerCoordinate: currentLocation,
                            zoomLevel: 5,
                        }}
                        {...mapCameraProps}
                    />
                    <MapboxGL.UserLocation
                        visible={true}
                        showUserLocation={true}
                        ref={locationRef}
                    />
                </MapboxGL.MapView>
            </View>
            <View style={styles.locationBar}>
                <TouchableOpacity
                    style={styles.locationWrapper}
                    onPress={handlePress}>
                    <Image
                        source={require('assets/images/locate.png')}
                        style={styles.locationIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Map;
