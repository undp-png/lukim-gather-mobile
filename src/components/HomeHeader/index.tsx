import React, {useCallback, useState} from 'react';
import {Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';
import Filters, {type FiltersProps} from 'components/Filters';
import SurveyListTab from 'components/SurveyListTab';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';

import COLORS from 'utils/colors';

import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';
import type {HomeNavParamList} from 'navigation/tab';

import styles from './styles';

interface Props {
    selectedTab?: string;
    setSelectedTab(selectedTab: string): void;
    homeScreen?: boolean;
    onExportPress?(): void;
    projectFilterId: FiltersProps['activeProjectId'];
    categoryFilterId: FiltersProps['activeCategoryId'];
    setProjectFilterId: FiltersProps['onProjectChange'];
    setCategoryFilterId: FiltersProps['onCategoryChange'];
}

const HomeHeader: React.FC<Props> = props => {
    const {
        selectedTab = 'all',
        setSelectedTab,
        homeScreen,
        onExportPress,
        projectFilterId,
        setProjectFilterId,
        categoryFilterId,
        setCategoryFilterId,
    } = props;
    const navigation =
        useNavigation<StackNavigationProp<StackParamList & HomeNavParamList>>();
    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onListPress = useCallback(
        () =>
            navigation.navigate('Surveys', {
                filters: {projectFilterId, categoryFilterId},
            }),
        [navigation, projectFilterId, categoryFilterId],
    );
    const onMapPress = useCallback(
        () =>
            navigation.navigate('HomeScreen', {
                filters: {projectFilterId, categoryFilterId},
            }),
        [navigation, projectFilterId, categoryFilterId],
    );

    const [isFilterActive, setFilterActive] = useState<boolean>(
        Boolean(homeScreen && (projectFilterId || categoryFilterId)),
    );
    const toggleFilterActive = useCallback(
        () => setFilterActive(fa => !fa),
        [],
    );

    const handleClearFilters = useCallback(() => {
        setProjectFilterId(null);
        setCategoryFilterId(null);
        setFilterActive(false);
    }, [setProjectFilterId, setCategoryFilterId]);

    return (
        <>
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
                    tabStyle={
                        homeScreen ? styles.homeScreenTab : styles.tabStyle
                    }
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
                        style={cs(
                            styles.exportBar,
                            [styles.whiteBg, homeScreen],
                            {
                                display: 'flex', //todo
                            },
                        )}>
                        <Image
                            source={require('assets/images/export.png')}
                            style={styles.exportIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {Boolean(homeScreen) && (
                <View
                    style={cs(styles.filterButton, [
                        styles.filterButtonLower,
                        isFilterActive,
                    ])}>
                    <TouchableOpacity
                        style={styles.filterButtonTouchable}
                        onPress={toggleFilterActive}>
                        <Icon
                            name={isFilterActive ? 'funnel' : 'funnel-outline'}
                            width={20}
                            height={20}
                            fill={COLORS.greyTextDark}
                        />
                    </TouchableOpacity>
                    {(projectFilterId || categoryFilterId) && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearFilters}>
                            <Text title="Clear" style={styles.clearText} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {(!homeScreen || isFilterActive) && (
                <View
                    style={cs(styles.filtersContainer, [
                        styles.filtersContainerListView,
                        !homeScreen,
                    ])}>
                    <Filters
                        isAbsolute={homeScreen}
                        activeProjectId={projectFilterId}
                        onProjectChange={setProjectFilterId}
                        activeCategoryId={categoryFilterId}
                        onCategoryChange={setCategoryFilterId}
                    />
                </View>
            )}
        </>
    );
};

export default HomeHeader;
