import { ui } from "~/ui";

export const languages = {
	en: "English",
};

type locale = keyof typeof languages;

class I18n {
	private defaultLang: locale = "en";
	private locale: locale;

	constructor(language: string) {
		if (language in languages) {
			this.locale = language as locale;
		} else {
			const [code] = language.split("-");

			this.locale = (code in languages ? code : this.defaultLang) as locale;
		}
	}

	t = (key: keyof (typeof ui)[typeof this.defaultLang]) => {
		return ui[this.locale][key] || ui[this.defaultLang][key];
	};
}

const i18n = new I18n(navigator.language);

export const t = i18n.t;
