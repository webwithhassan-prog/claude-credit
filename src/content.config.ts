import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    /** Optional shorter <title> (≤ 60 chars) when the H1 is long. */
    seoTitle: z.string().optional(),
    /** Meta description, 140–160 characters. */
    description: z.string(),
    /** Category id from src/data/categories.ts. */
    category: z.string(),
    /** Tool slugs to feature alongside the guide (first one gets the call-to-action box). */
    related: z.array(z.string()).default([]),
    published: z.string(),
    updated: z.string(),
  }),
});

export const collections = { guides };
