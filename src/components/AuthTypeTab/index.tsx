import React, {useCallback} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
}: {
    onPress(): void;
    title: string;
    activeTab: string;
    name: string;
    activeTabStyle?: object;
    activeTabTitle?: object;
}) => {
    return (
        <TouchableOpacity
            style={cs(
                styles.tabItem,
                [styles.activeTabItem, activeTab === name],
                [activeTabStyle, activeTab === name],
            )}
            onPress={onPress}>
            <Text
                style={cs(styles.tabTitle, [
                    activeTabTitle,
                    activeTab === name,
                ])}
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
}

const AuthTypeTab: React.FC<ListProps> = props => {
    const {selectedTab, setSelectedTab, tabStyle, ...tabItemProps} = props;
    const handlePhoneSelect = useCallback(
        () => setSelectedTab('phone'),
        [setSelectedTab],
    );
    const handleEmailSelect = useCallback(() => {
        setSelectedTab('email');
    }, [setSelectedTab]);
    return (
        <View style={cs(styles.tabWrapper, tabStyle)}>
            <TabItem
                name="email"
                activeTab={selectedTab}
                title={_('Email')}
                onPress={handleEmailSelect}
                {...tabItemProps}
            />
            <TabItem
                name="phone"
                activeTab={selectedTab}
                title={_('Phone')}
                onPress={handlePhoneSelect}
                {...tabItemProps}
            />
        </View>
    );
};

export default AuthTypeTab;
