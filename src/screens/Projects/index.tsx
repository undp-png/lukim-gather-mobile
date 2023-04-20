import React, {useCallback, useMemo} from 'react';
import {View, Text as RNText} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {format} from 'date-fns';

import Accordion from 'components/Accordion';
import {Loader} from 'components/Loader';
import Text from 'components/Text';

import {_} from 'services/i18n';
import {GET_USER_PROJECTS} from 'services/gql/queries';
import useQuery from 'hooks/useQuery';

import {ProjectType} from '@generated/types';

import styles from './styles';

const keyExtractor = (item: ProjectType) => String(item.id);

const ProjectContent = (projectItem: ProjectType) => {
    const lastModifiedValue = projectItem?.surveyLastModified
        ? format(new Date(projectItem.surveyLastModified), 'MMM dd, yyyy')
        : '-';

    return (
        <View>
            <RNText style={styles.description}>
                {projectItem?.description}
            </RNText>
            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={styles.statItemTitle} title="No. of members" />
                    <Text
                        style={styles.statItemValue}
                        title={projectItem?.totalUsers || '-'}
                    />
                </View>
                <View style={styles.separator} />
                <View style={styles.statItem}>
                    <Text style={styles.statItemTitle} title="No. of surveys" />
                    <Text
                        style={styles.statItemValue}
                        title={projectItem?.surveyCount || '-'}
                    />
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statItemTitle} title="Last updated" />
                    <Text
                        style={styles.statItemValue}
                        title={lastModifiedValue}
                    />
                </View>
                <View style={styles.separator} />
                <View style={styles.statItem}>
                    <Text style={styles.statItemTitle} title="Organization" />
                    <Text
                        style={styles.statItemValue}
                        title={projectItem?.organization?.title || '-'}
                    />
                </View>
            </View>
        </View>
    );
};

const Projects = () => {
    const {loading, data} = useQuery<{
        me: {projects: ProjectType[]};
    }>(GET_USER_PROJECTS);

    const renderItems = useCallback(({item}: {item: ProjectType}) => {
        return <Accordion item={item} renderContent={ProjectContent} />;
    }, []);

    const projects = useMemo(() => {
        return (data?.me?.projects || []) as ProjectType[];
    }, [data]);

    return (
        <View style={styles.container}>
            {loading ? (
                <Loader loading style={styles.loader} />
            ) : (
                <FlatList
                    data={projects}
                    renderItem={renderItems}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={
                        <Text
                            style={styles.text}
                            title={_('You have not been added to a project!')}
                        />
                    }
                />
            )}
        </View>
    );
};

export default Projects;
