import { resultDataDiv } from "./html";

export function createToggle(
	toggler: HTMLDivElement,
	panel: HTMLDivElement,
	cb?: (collapsed: boolean) => void,
) {
	let collapsed = false;

	return () => {
		collapsed = !collapsed;
		panel.classList.toggle("collapsed", collapsed);
		toggler.classList.toggle("collapsed", collapsed);
		toggler.textContent = collapsed ? "+" : "−";

		const len = document.querySelectorAll(".panel.collapsed").length;
		resultDataDiv.classList.toggle("minimal", !len);
		cb?.(collapsed);
	};
}
