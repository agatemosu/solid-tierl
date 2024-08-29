import { ui } from "~/ui";

type locale = keyof typeof ui;

class I18n {
	private defaultLang: locale = "en";
	private locale: locale;

	constructor(language: string) {
		if (language in ui) {
			this.locale = language as locale;
		} else {
			const [code] = language.split("-");

			this.locale = (code in ui ? code : this.defaultLang) as locale;
		}
	}

	t = (key: keyof (typeof ui)[typeof this.defaultLang]) => {
		return ui[this.locale][key] || ui[this.defaultLang][key];
	};
}

const i18n = new I18n(navigator.language);

export const t = i18n.t;
