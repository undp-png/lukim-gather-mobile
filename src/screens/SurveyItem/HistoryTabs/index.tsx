import React, {useCallback} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';

import Text from 'components/Text';

import cs from '@rna/utils/cs';

import styles from './styles';

type TabItem = {
    id: string | number;
    title: string;
};

interface HistoryTabsProps {
    style?: object;
    activeTabId: TabItem['id'];
    tabsData: TabItem[];
    onChangeTab: (tabItem: TabItem) => void;
}

const keyExtractor = (item: TabItem) => String(item.id);

interface HistoryTabItemProps {
    item: TabItem;
    index: number;
    activeTabId: HistoryTabsProps['activeTabId'];
    onPress: HistoryTabsProps['onChangeTab'];
}

const HistoryTabItem: React.FC<HistoryTabItemProps> = ({
    item,
    activeTabId,
    onPress,
}) => {
    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [onPress, item]);

    return (
        <View
            style={cs(styles.versionTabItem, [
                styles.versionTabItemActive,
                activeTabId === item.id,
            ])}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={handlePress}
                disabled={activeTabId === item.id}
                style={styles.versionTabTouchable}>
                <Text
                    style={cs(styles.versionTabItemText, [
                        styles.versionTabItemTextActive,
                        activeTabId === item.id,
                    ])}
                    title={item.title}
                />
            </TouchableOpacity>
        </View>
    );
};

const HistoryTabs: React.FC<HistoryTabsProps> = ({
    tabsData,
    onChangeTab,
    activeTabId,
    style,
}) => {
    const renderHistoryTabItem = useCallback(
        listProps => (
            <HistoryTabItem
                {...listProps}
                onPress={onChangeTab}
                activeTabId={activeTabId}
            />
        ),
        [activeTabId, onChangeTab],
    );

    return (
        <View style={style}>
            <FlatList
                style={styles.versionTabs}
                contentContainerStyle={styles.versionTabsContent}
                data={tabsData}
                horizontal
                keyExtractor={keyExtractor}
                renderItem={renderHistoryTabItem}
            />
        </View>
    );
};

export default HistoryTabs;
