import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        paddingVertical: 28,
        paddingHorizontal: 16,
    },
    notificationContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        marginBottom: 2,
    },
    notificationUnread: {
        backgroundColor: '#F0F3F7',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A52A1',
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
    notificationWrapper: {
        width: '90%',
        paddingLeft: 12,
        paddingRight: 6,
    },
    description: {
        flex: 1,
    },
    date: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        lineHeight: 15,
        color: COLORS.inputText,
        textAlign: 'left',
    },
});
