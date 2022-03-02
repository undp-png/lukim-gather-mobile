import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        display: 'flex',
        justifyContent: 'space-between',
    },
    userInfoWrapper: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#f0f3f7',
        borderBottomWidth: 10,
    },
    userImage: {
        height: 65,
        width: 65,
        borderRadius: 12,
        marginRight: 15,
    },
    userTextInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textWrapper: {
        display: 'flex',
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        lineHeight: 21.78,
        color: COLORS.tertiary,
    },
    userOrg: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        color: '#888c94',
    },
    menuWrapper: {
        display: 'flex',
        padding: 20,
    },
    menuItem: {
        paddingVertical: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19.36,
        color: COLORS.tertiary,
    },
    appVersion: {
        color: '#888C94',
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
});
