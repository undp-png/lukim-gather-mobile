import React, {FC} from 'react';
import {reduxForm} from 'redux-form';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {FormType, QuestionGroupType} from 'generated/types';

interface FormProps {
    form: FormType;
    formConfig?: object;
    [key: string]: any;
}

export interface ReduxFormProps extends Omit<FormProps, 'form'> {
    formName: string;
    questionGroups: QuestionGroupType[];
}

const withReduxForm = (WrappedComponent: FC<ReduxFormProps>) => {
    const WithReduxForm = ({form, formConfig = {}, ...props}: FormProps) => {
        WrappedComponent = React.memo<ReduxFormProps>(
            reduxForm({form: form.code, ...formConfig})(WrappedComponent),
        );
        return (
            <WrappedComponent
                formName={form.code}
                questionGroups={form.questionGroup}
                {...props}
            />
        );
    };

    return hoistNonReactStatic(WithReduxForm, WrappedComponent);
};

export default withReduxForm;
