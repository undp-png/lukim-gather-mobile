import React, {useMemo, useCallback} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RootStateOrAny, useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Text from 'components/Text';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';

import styles from './styles';

const TabItem = ({
    onPress,
    title,
    activeTab,
    name,
}: {
    onPress(): void;
    title: string;
    activeTab: string;
    name: string;
}) => {
    const {width} = useWindowDimensions();
    const tabWidth = useMemo(() => {
        return {width: width / 2 - 22};
    }, [width]);
    return (
        <TouchableOpacity
            style={cs(
                styles.tabItem,
                [styles.activeTabItem, activeTab === name],
                tabWidth,
            )}
            onPress={onPress}>
            <Text style={styles.tabTitle} title={title} />
        </TouchableOpacity>
    );
};

interface ListProps {
    selectedTab: string;
    setSelectedTab(selectedTab: string): void;
}

const SurveyListTab: React.FC<ListProps> = props => {
    const {selectedTab, setSelectedTab} = props;
    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const handleAllEntriesSelect = useCallback(
        () => setSelectedTab('all'),
        [setSelectedTab],
    );
    const handleMyEntriesSelect = useCallback(() => {
        if (!isAuthenticated) {
            return Toast.show(_('You are not logged in!'));
        }
        setSelectedTab('myentries');
    }, [isAuthenticated, setSelectedTab]);
    return (
        <View style={styles.tabWrapper}>
            <TabItem
                name="all"
                activeTab={selectedTab}
                title="All"
                onPress={handleAllEntriesSelect}
            />
            <TabItem
                name="myentries"
                activeTab={selectedTab}
                title="My Entries"
                onPress={handleMyEntriesSelect}
            />
        </View>
    );
};

export default SurveyListTab;
