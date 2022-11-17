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
    activeTabStyle,
    activeTabTitle,
    isHomeTab,
}: {
    onPress(): void;
    title: string;
    activeTab: string;
    name: string;
    activeTabStyle?: object;
    activeTabTitle?: object;
    isHomeTab?: boolean;
}) => {
    const {width} = useWindowDimensions();
    const tabWidth = useMemo(() => {
        if (isHomeTab) {
            return {width: width / 4 - 5};
        } else {
            return {width: width / 2 - 22};
        }
    }, [isHomeTab, width]);
    return (
        <TouchableOpacity
            style={cs(
                styles.tabItem,
                [styles.activeTabItem, activeTab === name],
                [activeTabStyle, activeTab === name],
                tabWidth,
            )}
            onPress={onPress}>
            <Text
                style={cs(
                    styles.tabTitle,
                    [activeTabTitle, activeTab === name],
                    [styles.homeTabTitle, isHomeTab],
                )}
                title={title}
            />
        </TouchableOpacity>
    );
};

interface ListProps {
    selectedTab: string;
    setSelectedTab(selectedTab: string): void;
    tabStyle?: object;
    activeTabStyle?: object;
    activeTabTitle?: object;
    isHomeTab?: boolean;
}

const SurveyListTab: React.FC<ListProps> = props => {
    const {selectedTab, setSelectedTab, tabStyle, ...tabItemProps} = props;
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
        <View style={cs(styles.tabWrapper, tabStyle)}>
            <TabItem
                name="all"
                activeTab={selectedTab}
                title={_('All')}
                onPress={handleAllEntriesSelect}
                {...tabItemProps}
            />
            <TabItem
                name="myentries"
                activeTab={selectedTab}
                title={_('My Entries')}
                onPress={handleMyEntriesSelect}
                {...tabItemProps}
            />
        </View>
    );
};

export default SurveyListTab;
