import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import Accordion from 'components/Accordion';
import {Loader} from 'components/Loader';
import Text from 'components/Text';

import {_} from 'services/i18n';
import {GET_USER_PROJECTS} from 'services/gql/queries';
import useQuery from 'hooks/useQuery';

import {ProjectType} from '@generated/types';

import styles from './styles';

const keyExtractor = (item: ProjectType) => String(item.id);

const Projects = () => {
    const {loading, data} = useQuery<{
        me: {projects: ProjectType[]};
    }>(GET_USER_PROJECTS);

    const renderItems = useCallback(({item}: {item: ProjectType}) => {
        return <Accordion item={item} />;
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
