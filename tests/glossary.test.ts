import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { glossary, termsForGuide, termsForTool } from '../src/data/glossary';
import { tools } from '../src/data/tools';

const guideSlugs = fs
  .readdirSync('src/content/guides')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

describe('glossary', () => {
  it('has unique, URL-safe ids', () => {
    const ids = glossary.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('links only to calculators, guides and terms that exist', () => {
    const slugs = new Set(tools.map((t) => t.slug));
    const ids = new Set(glossary.map((t) => t.id));
    for (const t of glossary) {
      for (const s of t.tools ?? []) expect(slugs.has(s), `${t.id} → tool ${s}`).toBe(true);
      for (const g of t.guides ?? []) expect(guideSlugs.includes(g), `${t.id} → guide ${g}`).toBe(true);
      for (const x of t.see ?? []) {
        expect(ids.has(x), `${t.id} → see ${x}`).toBe(true);
        expect(x).not.toBe(t.id);
      }
    }
  });

  it('uses plain-text definitions of a readable length', () => {
    for (const t of glossary) {
      expect(t.definition, t.id).not.toMatch(/[<>]/);
      expect(t.definition.length, t.id).toBeGreaterThan(60);
      expect(t.definition.length, t.id).toBeLessThan(420);
    }
  });

  it('gives every calculator and guide at least one key term', () => {
    for (const t of tools) expect(termsForTool(t.slug).length, t.slug).toBeGreaterThan(0);
    for (const g of guideSlugs) expect(termsForGuide(g).length, g).toBeGreaterThan(0);
  });
});
