const { Plugin } = require("obsidian");
const { Decoration, ViewPlugin } = require("@codemirror/view");

const PREFIX = /(^|\s)(@[\p{L}\p{N}_]+(?:['’\-][\p{L}\p{N}_]+)*)/gu;

function matches(text) {
  return Array.from(text.matchAll(PREFIX), match => ({
    from: match.index + match[1].length,
    to: match.index + match[0].length,
  }));
}

function editorDecorations(view) {
  const ranges = [];
  const seen = new Set();
  for (const visible of view.visibleRanges) {
    const first = view.state.doc.lineAt(visible.from).number;
    const last = view.state.doc.lineAt(visible.to).number;
    for (let number = first; number <= last; number++) {
      if (seen.has(number)) continue;
      seen.add(number);
      const line = view.state.doc.line(number);
      for (const match of matches(line.text)) {
        ranges.push(Decoration.mark({ class: "at-prefix-highlight" })
          .range(line.from + match.from, line.from + match.to));
      }
    }
  }
  return Decoration.set(ranges.sort((a, b) => a.from - b.from));
}

class AtPrefixHighlight extends Plugin {
  onload() {
    this.registerEditorExtension(ViewPlugin.fromClass(class {
      constructor(view) { this.decorations = editorDecorations(view); }
      update(update) {
        if (update.docChanged || update.viewportChanged)
          this.decorations = editorDecorations(update.view);
      }
    }, { decorations: value => value.decorations }));

    this.registerMarkdownPostProcessor(element => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest("a, code, pre, script, style, .at-prefix-highlight")) continue;
        if (matches(node.nodeValue).length) nodes.push(node);
      }
      for (const node of nodes) {
        const text = node.nodeValue;
        const fragment = document.createDocumentFragment();
        let offset = 0;
        for (const match of matches(text)) {
          fragment.append(document.createTextNode(text.slice(offset, match.from)));
          const span = document.createElement("span");
          span.className = "at-prefix-highlight";
          span.textContent = text.slice(match.from, match.to);
          fragment.append(span);
          offset = match.to;
        }
        fragment.append(document.createTextNode(text.slice(offset)));
        node.replaceWith(fragment);
      }
    });
  }
}

module.exports = AtPrefixHighlight;
