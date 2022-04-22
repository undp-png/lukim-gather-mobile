export interface InputProps {
    fieldContainerStyle?: object;
    containerStyle?: object;
    titleStyle?: object;
    title: string;
    showRequired?: boolean;
    inputStyle?: object;
    input: {
        value: any;
        onChange: (val: any) => void;
        [key: string]: any;
    };
    meta: {
        touched: boolean;
        error?: any;
        warning?: any;
    };
    inputProps: {
        [key: string]: any;
    };
}
