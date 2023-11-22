import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import node from "@astrojs/node"

import svelte from "@astrojs/svelte"

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), svelte()],
  adapter: node({
    mode: "standalone",
  }),
})