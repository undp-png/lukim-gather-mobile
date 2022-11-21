import {useMemo} from 'react';
import surveyCategory from 'services/data/surveyCategory';

import {searchTree} from 'utils';

import type {SurveyCategoryTree} from 'services/data/surveyCategory';

export const getCategoryIcon = (
    categories = surveyCategory,
    categoryId: number,
) => {
    if (!categoryId) {
        return null;
    }
    let node = searchTree(categories, categoryId);
    return node?.icon;
};

const useCategoryIcon = (categories: SurveyCategoryTree[], id: number) => {
    const iconSrc = useMemo(
        () => getCategoryIcon(categories, id),
        [categories, id],
    );
    return [iconSrc];
};

export default useCategoryIcon;
