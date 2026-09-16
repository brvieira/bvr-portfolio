const toc = document.querySelector<HTMLElement>("[data-article-toc]");
if (toc) {
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>("a[data-toc-target]"));
  const sections = links
    .map((link) => document.getElementById(link.dataset.tocTarget ?? ""))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          for (const link of links) {
            link.classList.toggle("active", link.dataset.tocTarget === id);
          }
        }
      },
      { rootMargin: "-104px 0px -70% 0px" },
    );
    for (const section of sections) observer.observe(section);
  }
}
