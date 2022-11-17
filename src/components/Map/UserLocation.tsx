import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';

interface UserLocationProps {
    visible: boolean;
}

export const UserLocation = ({visible}: UserLocationProps) => {
    return (
        <MapboxGL.UserLocation
            visible={visible}
            renderMode="native"
            androidRenderMode="compass"
            showsUserHeadingIndicator
        />
    );
};
