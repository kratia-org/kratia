import { isDev, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { api } from "~/core/api";
import { server$, useLocation } from "@builder.io/qwik-city";
import { format } from "@formkit/tempo";
import { localeContext } from "~/contexts/locale";
import { translationsContext } from "~/contexts/trasnlations";


const translate = server$(async (pathname: string, language: string, key: string) => {
    const getTranslation = await api.post("/platform/services/translate", {
        from: "en",
        to: language,
        text: key,
    })
    if (getTranslation.status == 200) {
        if (getTranslation.data?.TranslatedText) {
            console.log('i18n: translated key', key, "to", getTranslation.data?.TranslatedText);
            const setTranslation = await api.post("/platform/system/translations", {
                pathname: pathname,
                language: language,
                key: key,
                value: getTranslation.data?.TranslatedText,
            })
            if (setTranslation.status === 200) {
                console.log('i18n: set translation', key, getTranslation.data?.TranslatedText);
                return getTranslation.data?.TranslatedText
            } else {
                console.log('i18n: error setting translation', key, setTranslation.status, setTranslation.data);
            }
        }
    } else {
        console.log('i18n: error translating key', key, getTranslation.status, getTranslation.data);
    }
})

export const speak = () => {
    /* eslint-disable */
    const location = useLocation();
    const locale = useContext(localeContext)
    const translations = useContext(translationsContext)
    /* eslint-enable */

    const dateTime = useSignal()

    const inputKey = useSignal<string>("")
    const formatKey = useSignal<string>("")

    useTask$(({ track }) => {
        track(() => inputKey.value)
        track(() => locale.value)
        formatKey.value = format(inputKey.value, "full", locale.value.language?.alpha2 || "en")
    })

    return {
        t: (key: string) => {
            let tkey: string = key;
            if (translations?.value[key]) {
                tkey = translations.value[key]
            } else {
                if (locale.value.language && locale.value.language?.iso_alpha2 !== 'en') {
                    translate(location.url.pathname, locale.value.language.iso_alpha2, key).then(() => {
                        if (isDev) {
                            console.log('i18n: translated key', key)
                        }
                    })
                }
            }
            return tkey;
        },
        tdt: (key: string) => {
            let tkey: string = key;
            const lang = locale.value.language.iso_alpha2;
            if (translations?.value[lang]?.[key]) {
                tkey = translations.value[lang][key];
            } else {
                if (locale.value.language.iso_alpha2 !== 'en') {
                    if (!translations.value[lang]) translations.value[lang] = {};
                    tkey = format(key, "medium", lang);
                    translations.value[lang][key] = tkey;
                }
            }
            return tkey;
        }
    }
}