import React, {useState, useMemo, useCallback} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import DropdownPicker from 'react-native-dropdown-picker';

import useQuery from 'hooks/useQuery';

import {_} from 'services/i18n';
import cs from '@rna/utils/cs';

import {GET_PROJECTS} from 'services/gql/queries';
import surveyCategory, {
    type LocalCategoryType,
} from 'services/data/surveyCategory';

import type {ProjectType} from '@generated/types';

import styles from './styles';

export interface FiltersProps {
    isAbsolute?: boolean;
    activeProjectId: null | ProjectType['id'];
    activeCategoryId: null | LocalCategoryType['id'];
    onProjectChange: React.Dispatch<
        React.SetStateAction<null | ProjectType['id']>
    >;
    onCategoryChange: React.Dispatch<
        React.SetStateAction<null | ProjectType['id']>
    >;
}

const Filters: React.FC<FiltersProps> = ({
    isAbsolute,
    activeProjectId,
    activeCategoryId,
    onProjectChange,
    onCategoryChange,
}) => {
    const [projectFilterOpen, setProjectFilterOpen] = useState<boolean>(false);
    const [categoryFilterOpen, setCategoryFilterOpen] =
        useState<boolean>(false);

    const categoriesData = useMemo(() => {
        return (
            surveyCategory?.flatMap(cat =>
                cat.childs
                    ? cat.childs.map(ch => ({
                          name: ch.name,
                          id: ch.id,
                      }))
                    : [],
            ) || []
        );
    }, []);

    const {data} = useQuery(GET_PROJECTS);
    const projectsData = useMemo(() => {
        return data?.projects || [];
    }, [data]);

    const handleOutsidePress = useCallback(() => {
        setProjectFilterOpen(false);
        setCategoryFilterOpen(false);
    }, []);

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View>
                <View
                    style={cs(styles.container, [
                        styles.containerOpen,
                        projectFilterOpen || categoryFilterOpen,
                    ])}>
                    <DropdownPicker
                        open={projectFilterOpen}
                        schema={{
                            value: 'id',
                            label: 'title',
                        }}
                        value={activeProjectId}
                        setValue={onProjectChange}
                        multiple={false}
                        items={projectsData}
                        setOpen={setProjectFilterOpen}
                        containerStyle={cs(
                            styles.pickerContainer,
                            [
                                styles.pickerContainerOpen,
                                projectFilterOpen || categoryFilterOpen,
                            ],
                            [styles.pickerContainerAbsolute, isAbsolute],
                        )}
                        style={cs(styles.picker, styles.pickerLeft, [
                            styles.pickerAbsolute,
                            isAbsolute,
                        ])}
                        dropDownContainerStyle={cs(styles.dropdownContainer, [
                            styles.dropdownContainerAbsolute,
                            isAbsolute,
                        ])}
                        textStyle={styles.textStyle}
                        placeholder={_('Select project')}
                        maxHeight={400}
                        listItemContainerStyle={styles.projectListItemContainer}
                        itemSeparator
                        itemSeparatorStyle={styles.itemSeparator}
                        placeholderStyle={styles.placeholder}
                    />
                    <DropdownPicker
                        open={categoryFilterOpen}
                        schema={{
                            value: 'id',
                            label: 'name',
                        }}
                        value={activeCategoryId}
                        setValue={onCategoryChange}
                        // @ts-expect-error Unable to cast categories data as the type that this component expects.
                        items={categoriesData}
                        setOpen={setCategoryFilterOpen}
                        containerStyle={cs(
                            styles.pickerContainer,
                            [
                                styles.pickerContainerOpen,
                                projectFilterOpen || categoryFilterOpen,
                            ],
                            [styles.pickerContainerAbsolute, isAbsolute],
                        )}
                        style={cs(styles.picker, styles.pickerRight, [
                            styles.pickerAbsolute,
                            isAbsolute,
                        ])}
                        dropDownContainerStyle={cs(styles.dropdownContainer, [
                            styles.dropdownContainerAbsolute,
                            isAbsolute,
                        ])}
                        textStyle={styles.textStyle}
                        placeholder={_('Select category')}
                        searchable
                        searchPlaceholder={_('Search category...')}
                        searchContainerStyle={styles.searchContainer}
                        searchTextInputStyle={styles.searchTextInput}
                        maxHeight={400}
                        itemSeparator
                        itemSeparatorStyle={styles.itemSeparator}
                        placeholderStyle={styles.placeholder}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Filters;
