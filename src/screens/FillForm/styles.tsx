import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        padding: 20,
    },
    surveyTitleContainer: {
        marginBottom: 25,
    },
    surveyTitle: {
        marginTop: 0,
    },
    groupTitleContainer: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        color: COLORS.greyTextDark,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 100,
    },
    nextButton: {
        marginLeft: 'auto',
    },
});
