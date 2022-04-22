import {useMemo} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';

const useLukimInfo = type => {
    const info = useSelector((state: RootStateOrAny) => state.lukimInfo?.info);
    const infoData = useMemo(
        () => info?.find(el => el.documentType === type),
        [info, type],
    );
    return {description: infoData?.description};
};

export default useLukimInfo;
