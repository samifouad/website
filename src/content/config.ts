import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
	loader: glob({ pattern: "samifouad.*._.json", base: "./public/data/" }),
	schema: z.object({
		id: z.string(),
		title: z.string(),
		tag: z.string(),
		url: z.string(),
		code: z.string(),
		colour: z.string(),
		size: z.string(),
		lang: z.record(z.number()),
		topics: z.string().array(),
		readme: z.string()
	})
  })

//   let projectobj = {
//     id: repo,
//     title: info_data.title,
    // tag: info_data.tag,
    // url: info_data.url,
    // code: info_data.code,
    // colour: info_data.colour,
    // size: info_data.size,
    // lang: lang_data.data,
    // topics: topics_data.data,
    // readme: readme_data
//   }

// const blog = defineCollection({
// 	type: 'content',
// 	// Type-check frontmatter using a schema
// 	schema: z.object({
// 		title: z.string(),
// 		description: z.string(),
// 		// Transform string to Date object
// 		pubDate: z.coerce.date(),
// 		updatedDate: z.coerce.date().optional(),
// 		heroImage: z.string().optional(),
// 	}),
// });

// const projects = defineCollection({
// 	type: 'content',
// 	// Type-check frontmatter using a schema
// 	schema: z.object({
// 		title: z.string().optional(),
// 		tag: z.string().optional(),
// 		url: z.string().optional(),
// 		code: z.string().optional(),
// 		colour: z.string().optional(),
// 		size: z.string().optional(),
// 	}),
// });

export const collections = { projects };