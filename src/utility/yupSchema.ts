import {standValue} from 'asset/standardValue';
import * as yup from 'yup';
import {requireField, requireLength} from './format';
import I18Next from './I18Next';

export const yupUsername = () => {
    return yup
        .string()
        .required(requireField())
        .min(
            standValue.USERNAME_MIN_LENGTH,
            requireLength(
                standValue.USERNAME_MIN_LENGTH,
                standValue.USERNAME_MAX_LENGTH,
            ),
        );
};

export const yupPassword = (ref?: string) => {
    if (ref) {
        return yup
            .string()
            .required(requireField())
            .oneOf([yup.ref(ref), null], I18Next.t('alert.passNotMatch'));
    }

    return yup
        .string()
        .required(requireField())
        .min(
            standValue.PASSWORD_MIN_LENGTH,
            requireLength(
                standValue.PASSWORD_MIN_LENGTH,
                standValue.PASSWORD_MAX_LENGTH,
            ),
        )
        .matches(standValue.REGEX_PASSWORD, I18Next.t('alert.regexPass'));
};

export const yupEmail = () => {
    return yup
        .string()
        .required(requireField())
        .email(I18Next.t('alert.inValidEmail'));
};

export const yupPhone = () => {
    return yup
        .string()
        .required(requireField())
        .matches(standValue.REGEX_PHONE, I18Next.t('alert.inValidPhone'));
};

export const yupNoName = () => {
    return yup.string();
};
