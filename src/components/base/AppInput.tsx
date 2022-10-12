import {FONT_FAMILY} from 'asset/enum';
import React, {forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

const AppInput = (props: TextInputProps, ref: any) => {
    return (
        <TextInput ref={ref} {...props} style={[styles.text, props.style]} />
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: FONT_FAMILY.openSans,
    },
});

export default forwardRef(AppInput);
