import { clearHistoryBtn, historyDiv, historyPanel, toggleHistoryBtn } from "./html";
import { createToggle } from "./toggle";

const HISTORY_KEY = "random-git-history";

function getHistory(): string[] {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveToHistory(item: string) {
    const history = getHistory();
    history.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
        historyDiv.innerHTML = "<p>No history yet</p>";
        return;
    }
    const data = history.map(name =>
        `<li><a href="https://github.com/${name}" target="_blank">${name}</a></li>`
    );
    historyDiv.innerHTML = `<ul>${data.join("")}</ul>`;
}

function clearHistory() {
    if (!confirm("Clear history?")) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
}

renderHistory();
clearHistoryBtn.addEventListener("click", clearHistory);
toggleHistoryBtn.addEventListener("click", createToggle(toggleHistoryBtn, historyPanel));
