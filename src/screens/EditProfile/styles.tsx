import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        padding: 20,
    },
    imageWrapper: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 25,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.62)',
        zIndex: 2,
        position: 'absolute',
        top: 0,
        height: 100,
        width: 100,
        borderRadius: 12,
    },
    userImage: {
        height: 100,
        width: 100,
        borderRadius: 12,
    },
    camera: {
        top: 70,
        left: 70,
    },
    changeTitle: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        lineHeight: 20,
        color: COLORS.blueText,
    },
});
