import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const projects = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string().optional(),
		tag: z.string().optional(),
		url: z.string().optional(),
		code: z.string().optional(),
		colour: z.string().optional(),
		size: z.string().optional(),
	}),
});

export const collections = { blog, projects };