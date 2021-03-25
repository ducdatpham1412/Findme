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

    const selectChangeText = (value: string, onChangeControl: any) => {
        onChangeText ? onChangeText(value) : onChangeControl(value);
    };

    if (!formContext) return <StyleText i18Text="" />;

    return (
        <Controller
            control={control}
            name={name}
            rules={rule}
            defaultValue={defaultValue}
            render={({field: {onChange, value}}) => (
                <StyleInput
                    ref={ref}
                    onChangeText={value => selectChangeText(value, onChange)}
                    value={value}
                    errorMessage={errorMessage}
                    {...props}
                />
            )}
        />
    );
};

export default forwardRef(StyleInputForm);
