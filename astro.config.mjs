import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import vercel from "@astrojs/vercel/serverless";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://samifouad.com',
  integrations: [mdx(), sitemap(), tailwind(), svelte(), icon(), react()],
  output: "hybrid",
  adapter: vercel()
});