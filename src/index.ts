import "@wxn0brp/flanker-ui/html";

import { btn, langInput } from "./html";
import { findRandomRepo } from "./random";
import { loadLangData } from "./words";
import { createToggle } from "./toggle";

loadLangData();

btn.addEventListener("click", findRandomRepo);
langInput.on("change", () => {
    qs("#findBtn").focus();
});

const controlsToggler = qs("#toggleControl");
controlsToggler.addEventListener("click", createToggle(controlsToggler, qs("#controls")));

document.addEventListener("keydown", (e) => {
    if (e.key === "r") findRandomRepo();

    let num = parseInt(e.key);
    if (!isNaN(num)) {
        num -= 1;
        if (num < 0) num = 9;

        const allLinks = document.querySelectorAll<HTMLAnchorElement>("#result-data a");
        const link = allLinks[num];
        if (link)
            link.click();
    }
});
