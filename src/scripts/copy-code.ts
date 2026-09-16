// SPEC.md §6.1 REQ-6.2 — exact reference implementation.
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
  if (!navigator.clipboard) {
    btn.hidden = true;
    return;
  }
  btn.addEventListener("click", async () => {
    const code = btn.closest("[data-code-block]")?.querySelector("code");
    if (!code) return;
    await navigator.clipboard.writeText(code.textContent ?? "");
    btn.textContent = "copiado";
    setTimeout(() => (btn.textContent = "copiar"), 1600);
  });
});
