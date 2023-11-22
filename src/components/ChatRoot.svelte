<script lang="ts">
  import {
    QueryClient,
    QueryClientProvider,
    createQuery,
  } from "@tanstack/svelte-query"
  import Chat from "./Chat.svelte"

  export let SERVER_URL: string
  export let WEBSOCKET_URL: string
  export let inboxId: string

  const queryClient = new QueryClient()
</script>

<QueryClientProvider client={queryClient}>
  <Chat {WEBSOCKET_URL} {SERVER_URL} {inboxId} />
</QueryClientProvider>
