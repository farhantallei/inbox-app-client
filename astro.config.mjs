import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import node from "@astrojs/node"

import svelte from "@astrojs/svelte"

const port = import.meta.env.PORT ? Number(import.meta.env.PORT) : 3000

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), svelte()],
  adapter: node({
    mode: "standalone",
  }),
  server: { port },
})
