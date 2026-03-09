import { renderHistory, saveToHistory } from "./history";
import { btn, errorDiv, langInput, loadingDiv, pageInput, perPageInput, resultDataDiv, resultDiv } from "./html";
import { CONFIG } from "./vars";
import { langData } from "./words";

export async function findRandomRepo() {
    btn.disabled = true;
    loadingDiv.style.display = "";
    errorDiv.style.display = "none";
    resultDiv.style.display = "none";
    resultDataDiv.innerHTML = "";

    try {
        const language = langInput.value;
        const filtered = language === "all" ?
            langData :
            langData.filter(w => {
                const lang = w.language.toLowerCase();
                return lang === language.toLowerCase();
            });

        if (!filtered.length) throw new Error(`No words found for "${language}"`);

        const randomWord = filtered[Math.floor(Math.random() * filtered.length)];

        const url = new URL(CONFIG.GITHUB_API);
        url.searchParams.set("q", randomWord.word);
        url.searchParams.set("per_page", perPageInput.value);
        url.searchParams.set("page", pageInput.value);
        const githubUrl = url.toString();

        const ghRes = await fetch(githubUrl, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });

        if (ghRes.status === 403) {
            throw new Error("⚠️ Rate limit exceeded. Please try again later.");
        }
        if (!ghRes.ok) throw new Error(`GitHub API: ${ghRes.status}`);

        const ghData = await ghRes.json();

        if (!ghData.items?.length) {
            throw new Error(`No results for "${randomWord.word}" on page #${pageInput.value}. Please try again!`);
        }

        qs("#word").innerHTML = randomWord.word;
        qs("#category").innerHTML = randomWord.category || "-";
        qs("#lang").innerHTML = randomWord.language || language;

        ghData.items.forEach((repo: any) => {
            const div = document.createElement("div");

            div.innerHTML = `
<a href="${repo.html_url}" target="_blank">${repo.full_name}</a>
<p>${repo.description ? "Description: " + repo.description : "No description"}</p>
<p>Stars: ${repo.stargazers_count.toLocaleString()} | Forks: ${repo.forks_count.toLocaleString()}</p>
<p>Repo language: ${repo.language || "-"}</p>
<p>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
`;

            resultDataDiv.appendChild(div);

            saveToHistory(repo.full_name as string);
        });

        renderHistory();

        resultDiv.style.display = "";
    } catch (err) {
        console.error(err);
        errorDiv.innerHTML = err.message;
        errorDiv.style.display = "";
    } finally {
        loadingDiv.style.display = "none";
        btn.disabled = false;
    }
}
