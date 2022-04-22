import React, {FC} from 'react';
import {reduxForm} from 'redux-form';
import hoistNonReactStatic from 'hoist-non-react-statics';

interface FormProps {
    formName: string;
    formConfig?: object;
}

const withReduxForm = (WrappedComponent: FC<FormProps>) => {
    const WithReduxForm = ({
        formName,
        formConfig = {},
        ...props
    }: {
        formName: string;
        formConfig: object;
    }) => {
        WrappedComponent = React.memo(
            reduxForm({form: formName, ...formConfig})(WrappedComponent),
        );
        return <WrappedComponent formName={formName} {...props} />;
    };

    return hoistNonReactStatic(WithReduxForm, WrappedComponent);
};

export default withReduxForm;
