import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    mapContainer: {
        marginTop: 48,
        marginBottom: 20,
        flex: 1,
    },
    locationBar: {
        bottom: 20,
    },
});
