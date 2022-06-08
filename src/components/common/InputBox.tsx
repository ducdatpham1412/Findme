import Theme from 'asset/theme/Theme';
import StyleInput, {StyleInputProps} from 'components/base/StyleInput';
import React, {forwardRef} from 'react';
import {ScaledSheet} from 'react-native-size-matters';

const InputBox = (props: StyleInputProps, ref: any) => {
    return (
        <StyleInput
            ref={ref}
            inputStyle={styles.input}
            hasErrorBox={false}
            hasUnderLine={false}
            placeholderTextColor={Theme.common.blueInputHolder}
            {...props}
        />
    );
};

const styles = ScaledSheet.create({
    input: {
        color: Theme.common.white,
        backgroundColor: Theme.common.blueInput,
        paddingVertical: '14@ms',
        borderRadius: '6@ms',
    },
});

export default forwardRef(InputBox);
