import React, {useState, useCallback} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import Modal from 'components/Modal';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import COLORS from 'utils/colors';

import type {ProjectType} from '@generated/types';

import styles from './styles';

const keyExtractor = (item: ProjectType) => String(item.id);

const ProjectItem = ({
    item,
    onPress,
}: {
    item: ProjectType;
    onPress: (arg: ProjectType) => void;
}) => {
    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [onPress, item]);

    return (
        <TouchableOpacity style={styles.projectItem} onPress={handlePress}>
            <Text style={styles.projectTitle} title={item.title} />
        </TouchableOpacity>
    );
};

interface DisabledProjectInputProps {
    style?: object;
    projects?: ProjectType[];
    activeProject?: ProjectType | null;
    onChange?: (arg: ProjectType | null) => void;
    disabled: true;
}
interface EditableProjectInputProps {
    style?: object;
    projects: ProjectType[];
    activeProject?: ProjectType | null;
    onChange: (arg: ProjectType | null) => void;
    disabled?: false;
}

type ProjectInputProps = DisabledProjectInputProps | EditableProjectInputProps;

const ProjectInput: React.FC<ProjectInputProps> = props => {
    const {style, activeProject, onChange, disabled, projects} = props;

    const [showProjects, setShowProjects] = useState<boolean>(false);
    const toggleProjects = useCallback(() => {
        setShowProjects(sp => !sp);
    }, []);

    const handleSelectProject = useCallback(
        (item: ProjectType) => {
            onChange?.(item);
            toggleProjects();
        },
        [onChange, toggleProjects],
    );

    const handleRemoveProject = useCallback(() => {
        onChange?.(null);
    }, [onChange]);

    const renderProjectItem = useCallback(
        listProps => (
            <ProjectItem {...listProps} onPress={handleSelectProject} />
        ),
        [handleSelectProject],
    );

    return (
        <View style={style}>
            <TouchableOpacity
                style={styles.container}
                onPress={toggleProjects}
                disabled={Boolean(disabled || activeProject)}>
                <View style={styles.projectDetails}>
                    <Icon
                        name={
                            activeProject
                                ? 'folder-outline'
                                : 'plus-circle-outline'
                        }
                        width={24}
                        height={24}
                        fill={COLORS.blueTextAlt}
                        style={styles.addIcon}
                    />
                    <Text
                        style={cs(styles.addText, [
                            styles.addTextDisabled,
                            disabled || activeProject,
                        ])}
                        title={
                            activeProject
                                ? activeProject.title
                                : _('Add to project')
                        }
                    />
                    {Boolean(activeProject) && !disabled && (
                        <TouchableOpacity
                            style={styles.removeIconContainer}
                            onPress={handleRemoveProject}>
                            <Icon
                                name="close-circle"
                                width={24}
                                height={24}
                                fill={COLORS.greyLightAlt}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {activeProject && !disabled && (
                    <TouchableOpacity
                        style={styles.changeLink}
                        onPress={toggleProjects}>
                        <Text
                            style={styles.changeLinkText}
                            title={_('Change')}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
            <Modal
                isVisible={showProjects}
                onBackdropPress={toggleProjects}
                style={styles.projectsModal}>
                <View style={styles.modalContent}>
                    <View style={styles.modalResponder} />
                    <Text style={styles.modalHeader} title={_('Projects')} />
                    <FlatList
                        data={projects}
                        keyExtractor={keyExtractor}
                        renderItem={renderProjectItem}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default ProjectInput;
