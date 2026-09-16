import { visit } from "unist-util-visit";

// Wraps a Shiki-highlighted `<pre data-filename="...">` (filename set by the
// shiki transformer in astro.config.mjs, from the code fence's meta string)
// in the same chrome markup as `CodeBlock.astro`: a header bar with the
// filename and a copy button, sharing the single `copy-code.ts` script
// island across every article via `[data-copy]` / `[data-code-block]`.
export function rehypeCodeChrome() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === null) return;
      const filename = node.properties?.["data-filename"];
      if (!filename) return;

      const wrapper = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block"], "data-code-block": true },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block-bar"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["code-block-filename"] },
                children: [{ type: "text", value: String(filename) }],
              },
              {
                type: "element",
                tagName: "button",
                properties: { type: "button", className: ["code-block-copy"], "data-copy": true },
                children: [{ type: "text", value: "copiar" }],
              },
            ],
          },
          node,
        ],
      };

      parent.children[index] = wrapper;
    });
  };
}
