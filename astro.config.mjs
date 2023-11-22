import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import node from "@astrojs/node"
import dotenv from "dotenv"

import svelte from "@astrojs/svelte"

dotenv.config()

const port = process.env.PORT ? Number(process.env.PORT) : 3000

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), svelte()],
  adapter: node({
    mode: "standalone",
  }),
  server: { port },
})
