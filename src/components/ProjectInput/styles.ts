import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    projectDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addText: {
        color: COLORS.blueTextAlt,
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        lineHeight: 20,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    addTextDisabled: {
        color: COLORS.greyTextDark,
    },
    addIcon: {
        marginRight: 10,
    },
    removeIconContainer: {
        padding: 4,
    },
    changeLink: {
        marginLeft: 24,
    },
    changeLinkText: {
        color: COLORS.blueTextAlt,
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
    },
    projectsModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalResponder: {
        height: 4,
        width: 65,
        backgroundColor: '#C4C4C4',
        alignSelf: 'center',
    },
    modalHeader: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        lineHeight: 30,
        color: COLORS.tertiary,
        marginBottom: 18,
        marginTop: 24,
    },
    projectItem: {
        marginVertical: 14,
    },
    projectTitle: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: COLORS.greyTextDark,
    },
});
