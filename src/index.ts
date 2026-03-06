import "@wxn0brp/flanker-ui/html";

import { btn, langInput } from "./html";
import { findRandomRepo } from "./random";
import { loadLangData } from "./words";

loadLangData();

btn.addEventListener("click", findRandomRepo);
langInput.on("change", () => {
    qs("#findBtn").focus();
});
