import {useMemo, useCallback} from 'react';

import {searchTree} from 'utils';

const useCategoryIcon = (categories, id) => {
    const getIcon = useCallback((item, categoryId) => {
        if (!categoryId) {
            return null;
        }
        let node = searchTree(item, categoryId);
        return node?.icon;
    }, []);

    const iconSrc = useMemo(
        () => getIcon(categories, id),
        [getIcon, categories, id],
    );
    return [iconSrc];
};

export default useCategoryIcon;
