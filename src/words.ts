import { btn, errorDiv, loadingDiv } from "./html";
import { Word } from "./types";
import { CONFIG } from "./vars";

export let langData: Word[] = [];

export async function loadLangData() {
    loadingDiv.style.display = "";
    try {
        const res = await fetch(CONFIG.WORDS_API);
        langData = await res.json();

        const langs = new Map<string, true>();

        langData.forEach(w => {
            const lang = w.language.toLowerCase();
            langs.set(lang, true);
        });

        const options = [...langs.keys()]
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
