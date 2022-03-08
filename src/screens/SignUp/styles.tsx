import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
    },
    name: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fullName: {
        marginRight: 6,
        flex: 1,
    },
    surName: {
        marginLeft: 6,
        flex: 1,
    },
    infoWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
    },
    info: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        marginRight: 5,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiaryAlt,
    },
    infoPressable: {
        fontSize: 14,
        fontWeight: '600',
        paddingRight: 5,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.primaryBlue,
    },
    button: {
        marginTop: 20,
    },
    text: {
        color: COLORS.primary,
        marginTop: 30,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
    },
});
