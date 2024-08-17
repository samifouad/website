import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from "@astrojs/tailwind"
import svelte from "@astrojs/svelte"
import icon from "astro-icon"
import react from "@astrojs/react"
import vercelServerless from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless(),
  site: 'https://samifouad.com',
  integrations: [mdx(), sitemap(), tailwind(), svelte(), icon(), react()],
  experimental: {
    contentLayer: true
  }
});