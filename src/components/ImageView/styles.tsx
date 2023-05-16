import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F3F7',
    },
    images: {
        borderRadius: 8,
        height: 110,
        width: 150,
        resizeMode: 'cover',
        marginRight: 16,
        backgroundColor: '#F0F3F7',
    },
    imageContainer: {
        position: 'relative',
    },
    errorTextContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -16,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        textAlign: 'center',
        width: '65%',
        fontSize: 10,
        color: COLORS.primaryLight,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    closeIcon: {
        alignSelf: 'flex-start',
        left: 10,
        top: 10,
        zIndex: 1,
    },
    text: {
        color: COLORS.greyTextDark,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
});
