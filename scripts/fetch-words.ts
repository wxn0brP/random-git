import { writeFileSync } from "fs";

const SOURCE =
	"https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018";

const LANGUAGES: Record<string, string> = {
	ar: "ar_50k.txt",
	de: "de_50k.txt",
	en: "en_50k.txt",
	es: "es_50k.txt",
	fr: "fr_50k.txt",
	hi: "hi_full.txt",
	it: "it_50k.txt",
	ja: "ja_full.txt",
	ko: "ko_50k.txt",
	nl: "nl_50k.txt",
	pl: "pl_50k.txt",
	pt_br: "pt_br_50k.txt",
	ro: "ro_50k.txt",
	ru: "ru_50k.txt",
	tr: "tr_50k.txt",
	zh_cn: "zh_cn_50k.txt",
};

const BANDS = [
	{ category: "top-1k", from: 1, to: 1000, limit: 300 },
	{ category: "top-10k", from: 1001, to: 10000, limit: 300 },
	{ category: "top-50k", from: 10001, to: 50000, limit: 200 },
];

const WORD_RE = /^[\p{L}\p{M}]{2,24}$/u;
const NOISE_RE = /(.)\1{2}/u;
const NON_LATIN = new Set(["ar", "hi", "ja", "ko", "ru", "zh_cn"]);

const OUTPUT = `${import.meta.dirname}/../public/data/words.json`;

const sample = (words: string[], limit: number) => {
	if (words.length <= limit) return words;
	const step = words.length / limit;
	return Array.from({ length: limit }, (_, i) => words[Math.floor(i * step)]);
};

const data: Record<string, Record<string, string[]>> = {};

for (const [language, file] of Object.entries(LANGUAGES)) {
	const res = await fetch(`${SOURCE}/${language}/${file}`);
	if (!res.ok) throw new Error(`${language}: HTTP ${res.status} (${file})`);

	const lines = (await res.text()).split("\n");
	const seen = new Set<string>();
	const bands: Record<string, string[]> = {};

	for (let i = 0; i < lines.length; i++) {
		const band = BANDS.find(b => i + 1 >= b.from && i + 1 <= b.to);
		if (!band) continue;

		const word = lines[i].split(/\s+/)[0];
		if (!word || !WORD_RE.test(word) || NOISE_RE.test(word)) continue;
		if (NON_LATIN.has(language) && /^[\x21-\x7e]+$/.test(word)) continue;

		const key = word.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);

		(bands[band.category] ??= []).push(word);
	}

	const picked: Record<string, string[]> = {};
	for (const band of BANDS) {
		const words = bands[band.category];
		if (words?.length) picked[band.category] = sample(words, band.limit);
	}
	if (!Object.keys(picked).length) throw new Error(`${language}: no words left`);

	data[language] = picked;
	console.log(
		language,
		Object.entries(picked)
			.map(([category, words]) => `${category}=${words.length}`)
			.join(" "),
	);
}

await writeFileSync(OUTPUT, JSON.stringify(data));
console.log(`wrote ${OUTPUT} (${Object.keys(data).length} languages)`);
