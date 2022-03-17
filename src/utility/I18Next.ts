import en from 'asset/language/en';
import vi from 'asset/language/vi';
import I18Next from 'i18next';
import {initReactI18next} from 'react-i18next';

I18Next.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        vi: {
            translation: vi,
        },
    },
    lng: I18Next.language,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    nsSeparator: false,
});

export default I18Next;
