import {useMemo} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';

import type {LegalDocumentType} from '@generated/types';

const useLukimInfo = (type: string) => {
    const info = useSelector((state: RootStateOrAny) => state.lukimInfo?.info);
    const infoData = useMemo(
        () => info?.find((el: LegalDocumentType) => el.documentType === type),
        [info, type],
    );
    return {description: infoData?.description};
};

export default useLukimInfo;
