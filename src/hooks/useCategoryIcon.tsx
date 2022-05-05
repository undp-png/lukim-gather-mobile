import {useMemo} from 'react';
import surveyCategory from 'services/data/surveyCategory';

import {searchTree} from 'utils';

export const getCategoryIcon = (categories = surveyCategory, categoryId) => {
    if (!categoryId) {
        return null;
    }
    let node = searchTree(categories, categoryId);
    return node?.icon;
};

const useCategoryIcon = (categories, id) => {
    const iconSrc = useMemo(
        () => getCategoryIcon(categories, id),
        [categories, id],
    );
    return [iconSrc];
};

export default useCategoryIcon;
