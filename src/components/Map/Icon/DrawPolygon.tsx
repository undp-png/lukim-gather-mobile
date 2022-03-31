import React from 'react';
import Svg, {Path, G, Circle} from 'react-native-svg';

import COLORS from 'utils/colors';

interface Props {
    active?: boolean;
}

export default ({active}: Props) => {
    const activeColor = active ? COLORS.success : COLORS.blueText;
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <G transform="translate(2 -1030)">
                <Path
                    d="m 5,1039.3622 0,6 2,2 6,0 2,-2 0,-6 -2,-2 -6,0 z m 3,0 4,0 1,1 0,4 -1,1 -4,0 -1,-1 0,-4 z"
                    fill={activeColor}
                />
                <Circle cx="6" cy="1046.3622" r="2" fill={activeColor} />
                <Circle cx="14" cy="1046.3622" r="2" fill={activeColor} />
                <Circle cx="6" cy="1038.3622" r="2" fill={activeColor} />
                <Circle cx="14" cy="1038.3622" r="2" fill={activeColor} />
            </G>
        </Svg>
    );
};
