import { btn, errorDiv, loadingDiv } from "./html";
import { Word } from "./types";
import { CONFIG } from "./vars";

export let langData: Word[] = [];

type WordsFile = Record<string, Record<string, string[]>>;

export async function loadLangData() {
	loadingDiv.style.display = "";
	try {
		const res = await fetch(CONFIG.WORDS_DATA);
		if (!res.ok) throw new Error(`words data: ${res.status}`);

		const file = (await res.json()) as WordsFile;
		langData = Object.entries(file).flatMap(([language, categories]) =>
			Object.entries(categories).flatMap(([category, words]) =>
				words.map(word => ({
					word,
					language,
					category,
					length: word.length,
				})),
			),
		);

		const langs = new Map<string, true>();

		langData.forEach(w => {
			const lang = w.language.toLowerCase();
			langs.set(lang, true);
		});

		const options = [
			...langs.keys(),
		]
			.map(lang => `<option value="${lang}">${lang}</option>`)
			.join("");
		qs("#language").innerHTML =
			`<option value="all">All languages</option>` + options;

		btn.disabled = false;
		loadingDiv.style.display = "none";
	} catch (e) {
		console.error(e);
		errorDiv.innerHTML = "⚠️ Failed to load words data. Please try again later.";
		errorDiv.style.display = "";
	}
}
