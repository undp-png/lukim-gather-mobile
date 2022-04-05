import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';

import riversSource from 'assets/map/rivers.json';
import oceanSource from 'assets/map/ocean.json';
import lakesSource from 'assets/map/lakes.json';
import countriesSource from 'assets/map/countries.json';
import landSource from 'assets/map/land.json';

import styles from './styles';

const OfflineLayers = () => {
    return (
        <React.Fragment>
            <MapboxGL.ShapeSource id="lakes-source" shape={lakesSource} />
            <MapboxGL.ShapeSource id="rivers-source" shape={riversSource} />
            <MapboxGL.ShapeSource
                id="boundaries-source"
                shape={countriesSource}
            />
            <MapboxGL.ShapeSource id="ocean-source" shape={oceanSource} />
            <MapboxGL.ShapeSource id="land-source" shape={landSource} />
        </React.Fragment>
    );
};

export default OfflineLayers;
