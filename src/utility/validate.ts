import {standValue} from 'asset/standardValue';
import * as yup from 'yup';
import {requireField, requireLength} from './format';
import I18Next from './I18Next';

const REGEX_EMAIL =
    /^(([^<>()[\]\\x.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REGEX_PHONE = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const REGEX_PASSWORD = /^[aA-zZ0-9]*$/;

export const validateIsEmail = (email: string) => {
    return REGEX_EMAIL.test(email);
};

export const validateIsPhone = (phone: string) => {
    return REGEX_PHONE.test(phone);
};

export const yupValidate = {
    username: () => {
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
    },
    password: (ref?: string) => {
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
            .matches(REGEX_PASSWORD, I18Next.t('alert.regexPass'));
    },
    email: () => {
        return yup
            .string()
            .required(requireField())
            .email(I18Next.t('alert.inValidEmail'));
    },
    phone: () => {
        return yup
            .string()
            .required(requireField())
            .matches(REGEX_PHONE, I18Next.t('alert.inValidPhone'));
    },
    default: () => {
        return yup.string();
    },
};
