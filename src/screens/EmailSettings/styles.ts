import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
    },
    infoText: {
        color: COLORS.inputText,
        marginTop: 8,
        fontFamily: 'Inter-Regular',
    },
    modal: {
        margin: 0,
        flex: 1,
        backgroundColor: '#10182870',
    },
    modalContent: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    heading: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        lineHeight: 29.05,
        color: COLORS.tertiary,
    },
    passwordButton: {
        marginTop: 16,
    },
});
