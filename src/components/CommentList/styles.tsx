import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 48 / 2,
    },
    commentItem: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 12,
    },
    replyContainer: {
        marginLeft: 48,
    },
    commentInfoWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        color: COLORS.greyLightAlt,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        color: COLORS.grey600,
        fontFamily: 'Inter-Regular',
        fontSize: 12,
    },
    description: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 10,
    },
    contentContainer: {
        backgroundColor: 'transparent',
    },
    response: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    like: {
        flexDirection: 'row',
        marginRight: 14,
    },
    likeCounter: {
        color: COLORS.grey400,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
    },
    reply: {
        color: COLORS.grey400,
        fontFamily: 'Inter-Regular',
        fontSize: 12,
    },
    more: {
        color: COLORS.greyText,
        fontFamily: 'Inter-Regular',
        fontSize: 14,
    },
    noComment: {
        alignItems: 'center',
        fontSize: 16,
        color: COLORS.greyText,
    },
});
