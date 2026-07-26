import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';

const CALLOUT = /^\[!(note|warning|pitfall)\][ \t]*\n?/i;

interface WithHProperties extends Node {
    data?: { hProperties?: Record<string, string> };
}

interface CodeNode extends WithHProperties {
    lang?: string | null;
    meta?: string | null;
}

interface TextNode extends Node {
    value: string;
}

const setProperty = (node: WithHProperties, key: string, value: string): void => {
    node.data = node.data ?? {};
    node.data.hProperties = { ...node.data.hProperties, [key]: value };
};

export const remarkCodeMeta = () => (tree: Node): void => {
    visit(tree, 'code', (node: Node) => {
        const code = node as CodeNode;
        if (!code.lang) return;

        const separator = code.lang.indexOf(':');
        if (separator < 0) return;

        const file = code.lang.slice(separator + 1);
        code.lang = code.lang.slice(0, separator);
        if (file) setProperty(code, 'data-file', file);
    });
};

export const remarkCallout = () => (tree: Node): void => {
    visit(tree, 'blockquote', (node: Node) => {
        const quote = node as Parent & WithHProperties;
        const paragraph = quote.children?.[0] as Parent | undefined;
        if (!paragraph || paragraph.type !== 'paragraph') return;

        const first = paragraph.children?.[0] as TextNode | undefined;
        if (!first || first.type !== 'text') return;

        const match = first.value.match(CALLOUT);
        if (!match) return;

        first.value = first.value.slice(match[0].length);
        setProperty(quote, 'data-callout', match[1].toLowerCase());
    });
};
