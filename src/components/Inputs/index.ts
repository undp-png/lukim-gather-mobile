import {WrappedFieldProps} from 'redux-form';

export interface InputProps extends WrappedFieldProps {
    fieldContainerStyle?: object;
    containerStyle?: object;
    titleStyle?: object;
    title: string;
    showRequired?: boolean;
    inputStyle?: object;
    input: {
        value: any;
        onChange: (val: any) => void;
        onBlur: () => void;
        onFocus: () => void;
        onDrop: () => void;
        onDragStart: () => void;
        name: string;
    };
    inputProps: {
        editable?: boolean;
        [key: string]: any;
    };
}
