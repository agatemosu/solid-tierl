import { ui } from "~/ui";

type Locale = keyof typeof ui;

class I18n {
	defaultLang: Locale = "en";
	locale: Locale = this.defaultLang;

	setLanguage = (acceptLanguage: string | null) => {
		if (acceptLanguage == null) return;

		const languages = acceptLanguage.split(",");

		for (const lang of languages) {
			const [locale] = lang.split(";q=");

			if (locale in ui) {
				this.locale = locale as Locale;
				break;
			}
		}
	};

	t = (key: keyof (typeof ui)[typeof this.defaultLang]) => {
		return ui[this.locale][key] || ui[this.defaultLang][key];
	};
}

const i18n = new I18n();

export const t = i18n.t;
export default i18n;
