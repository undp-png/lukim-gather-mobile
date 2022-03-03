import React from 'react';

import Text from 'components/Text';

import Button from '@rna/components/Button';
import cs from '@rna/utils/cs';

import styles from './styles';

const _Button = ({style, title, dark = false, ...buttonProps}) => {
    return (
        <Button
            style={cs(styles.button, [styles.buttonDark, dark], style)}
            pressableStyle={styles.buttonContent}
            {...buttonProps}>
            <Text
                style={cs(styles.buttonText, [styles.textDark, dark])}
                title={title}
            />
        </Button>
    );
};

export default _Button;
