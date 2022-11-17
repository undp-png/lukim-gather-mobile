import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';

import riversSource from 'assets/map/rivers.json';
import oceanSource from 'assets/map/ocean.json';
import lakesSource from 'assets/map/lakes.json';
import countriesSource from 'assets/map/countries.json';
import landSource from 'assets/map/land.json';

import type {GeometryCollection, Geometry} from 'geojson';

const OfflineLayers = () => {
    return (
        <React.Fragment>
            <MapboxGL.ShapeSource
                id="lakes-source"
                shape={lakesSource as GeometryCollection<Geometry>}
            />
            <MapboxGL.ShapeSource
                id="rivers-source"
                shape={riversSource as GeometryCollection<Geometry>}
            />
            <MapboxGL.ShapeSource
                id="boundaries-source"
                shape={countriesSource as GeometryCollection<Geometry>}
            />
            <MapboxGL.ShapeSource
                id="ocean-source"
                shape={oceanSource as GeometryCollection<Geometry>}
            />
            <MapboxGL.ShapeSource
                id="land-source"
                shape={landSource as GeometryCollection<Geometry>}
            />
        </React.Fragment>
    );
};

export default OfflineLayers;
