import React, {useCallback} from 'react';
import {Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';
import SurveyListTab from 'components/SurveyListTab';

import cs from '@rna/utils/cs';

import {_} from 'services/i18n';

import styles from './styles';

interface Props {
    selectedTab?: string;
    setSelectedTab?(selectedTab: string): void;
    homeScreen?: boolean;
    onExportPress?(): void;
}

const HomeHeader: React.FC<Props> = props => {
    const {
        selectedTab = 'all',
        setSelectedTab,
        homeScreen,
        onExportPress,
    } = props;
    const navigation = useNavigation();
    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onListPress = useCallback(
        () => navigation.navigate('Surveys'),
        [navigation],
    );
    const onMapPress = useCallback(
        () => navigation.navigate('HomeScreen'),
        [navigation],
    );
    return (
        <View style={cs(styles.header, [styles.homeHeader, homeScreen])}>
            <TouchableOpacity
                onPress={homeScreen ? onListPress : onMapPress}
                style={cs(styles.menuBar, homeScreen && styles.shadowItem)}>
                <Icon
                    name={homeScreen ? 'list-outline' : 'map'}
                    height={22}
                    width={22}
                    fill={'#fff'}
                />
                <Text
                    style={styles.title}
                    title={homeScreen ? _('List') : _('Map')}
                />
            </TouchableOpacity>
            <SurveyListTab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabStyle={homeScreen ? styles.homeScreenTab : styles.tabStyle}
                activeTabStyle={cs(homeScreen && styles.activeTabStyle)}
                activeTabTitle={styles.activeTabTitle}
                isHomeTab={true}
            />
            <View style={styles.rightBar}>
                <TouchableOpacity
                    onPress={onSearchPress}
                    style={cs(styles.searchBar, styles.rightMargin, [
                        styles.whiteBg,
                        homeScreen,
                    ])}>
                    <Icon
                        name="search-outline"
                        height={22}
                        width={22}
                        fill={'#101828'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onExportPress}
                    style={cs(styles.exportBar, [styles.whiteBg, homeScreen], {
                        display: 'flex', //todo
                    })}>
                    <Image
                        source={require('assets/images/export.png')}
                        style={styles.exportIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeHeader;
