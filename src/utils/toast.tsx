import React from 'react';
import Toast, {
    BaseToast,
    type ToastOptions,
    type BaseToastProps,
} from 'react-native-toast-message';

import COLORS from './colors';

const successToastStyle = {
    height: 'auto',
    paddingVertical: 18,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderLeftColor: COLORS.success,
};
const errorToastStyle = {
    height: 'auto',
    paddingVertical: 18,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderLeftColor: COLORS.error,
};
const text1Style = {
    color: COLORS.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
};
const text2Style = {
    color: COLORS.white,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
};

export const toastConfig = {
    success: (props: BaseToastProps) => (
        <BaseToast
            {...props}
            style={successToastStyle}
            text1Style={text1Style}
            text2Style={text2Style}
            text1NumberOfLines={2}
            text2NumberOfLines={3}
        />
    ),
    error: (props: BaseToastProps) => (
        <BaseToast
            {...props}
            style={errorToastStyle}
            text1Style={text1Style}
            text2Style={text2Style}
            text1NumberOfLines={2}
            text2NumberOfLines={3}
        />
    ),
};

export default {
    show: (text1: string, options?: ToastOptions & {text2?: string}) => {
        Toast.show({
            text1,
            text2: options?.text2,
        });
    },
    error: (text1: string, text2?: string, options?: ToastOptions) => {
        Toast.show({
            type: 'error',
            text1,
            text2,
            ...(options || {}),
        });
    },
};
