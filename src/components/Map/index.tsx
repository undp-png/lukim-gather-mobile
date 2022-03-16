import React from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';

import HomeHeader from 'components/HomeHeader';

import {MAPBOX_ACCESS_TOKEN} from '@env';

import styles from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
    return (
        <View style={styles.page}>
            <HomeHeader />
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map} />
            </View>
            <View style={styles.locationBar}>
                <TouchableOpacity style={styles.locationWrapper}>
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
