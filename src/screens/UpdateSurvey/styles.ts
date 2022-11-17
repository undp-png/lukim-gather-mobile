import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        paddingBottom: 50,
    },
    categoryContainer: {
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    categoryText: {
        fontSize: 24,
        lineHeight: 29,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.blueTextAlt,
    },
    project: {
        marginBottom: 16,
    },
    lastUpdate: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastUpdateText: {
        marginRight: 6,
        color: COLORS.grey400,
        fontFamily: 'Inter-Regular',
    },
    lastUpdateDate: {
        fontFamily: 'Inter-SemiBold',
        color: COLORS.grey400,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19,
        marginTop: 32,
        marginBottom: 11,
        color: COLORS.grey400,
    },
    locationWrapper: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
        backgroundColor: '#E7ECF2',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    disabledInputText: {
        color: COLORS.inputText,
    },
    locationText: {
        marginLeft: 14,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    pressInput: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    initialValueContainer: {
        alignSelf: 'flex-end',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    initialValueText: {
        color: COLORS.grey400,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        textAlign: 'right',
    },
    textarea: {
        height: 156,
    },
});
