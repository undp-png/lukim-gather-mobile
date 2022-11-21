import {StyleSheet} from 'react-native';
import {Expression, Anchor} from '@react-native-mapbox-gl/maps';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    page: {
        backgroundColor: COLORS.background,
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
    locationBar: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 5,
    },
    drawPolygon: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 5,
    },
    locationWrapper: {
        backgroundColor: COLORS.white,
        height: 35,
        width: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        height: 20,
        width: 20,
    },
    markerContainer: {
        alignItems: 'center',
        width: 45,
        backgroundColor: 'transparent',
    },
    markerLine: {
        height: 12,
        width: 2,
        backgroundColor: COLORS.blueTextAlt,
    },
    markerDotOuter: {
        width: 25,
        height: 25,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    markerDotInner: {
        width: 14,
        height: 14,
        borderRadius: 14,
        backgroundColor: COLORS.blueTextAlt,
    },
});

export const mapStyles = {
    polygonFill: {
        fillOpacity: 0.7,
        fillAntialias: true,
        fillColor: 'rgba(64, 88, 116, 0.31)',
        fillOutlineColor: COLORS.blueText,
    },
    pointCircle: {
        circleRadius: 10,
        circleColor: COLORS.white,
    },
    pointCount: {
        textColor: 'white',
        textField: ['get', 'point_count_abbreviated'] as Expression,
        textSize: 16,
    },
    clusterPoints: {
        circleColor: '#5486BD',
        circleRadius: 20,
    },
    singlePoint: {
        iconImage: [
            'get',
            'id',
            ['get', 'category', ['get', 'surveyItem']],
        ] as Expression,
        iconAllowOverlap: true,
        iconSize: 0.45,
        iconAnchor: 'bottom' as Anchor,
        iconOffset: [-6, -58],
    },
    marker: {
        iconImage: 'marker',
        iconAllowOverlap: true,
        iconAnchor: 'bottom' as Anchor,
        iconSize: 1,
    },
    polygon: {
        fillOpacity: 0.7,
        fillColor: '#b4b4b4',
        fillOutlineColor: '#b4b4b4',
    },
    polyTitle: {
        textColor: '#0033cc',
        textField: ['get', 'title'] as Expression,
        textSize: 16,
    },
};
