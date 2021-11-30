import React, {forwardRef} from 'react';
import {Controller, RegisterOptions, useFormContext} from 'react-hook-form';
import StyleInput, {StyleInputProps} from './StyleInput';
import StyleText from './StyleText';

interface StyleInputFormProps extends StyleInputProps {
    name: string;
    rule?: RegisterOptions;
    defaultValue?: string;
}

const StyleInputForm = (props: StyleInputFormProps, ref: any) => {
    const {name, rule, defaultValue, onChangeText} = props;
    const formContext = useFormContext();
    const {
        control,
        formState: {errors},
    } = formContext;
    const errorMessage = errors?.[name]?.message || '';

    if (!formContext) {
        return <StyleText i18Text="" />;
    }

    return (
        <Controller
            control={control}
            name={name}
            rules={rule}
            defaultValue={defaultValue}
            render={({field: {onChange, value}}) => (
                <StyleInput
                    ref={ref}
                    onChangeText={text =>
                        onChangeText?.(text) || onChange(text)
                    }
                    value={value}
                    errorMessage={errorMessage}
                    {...props}
                />
            )}
        />
    );
};

export default forwardRef(StyleInputForm);
