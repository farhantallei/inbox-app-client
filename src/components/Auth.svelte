<script lang="ts">
  import Login from "./Login.svelte"
  import { token, username } from "../stores"
  import { onMount } from "svelte"
  import axios, { AxiosError } from "axios"
  import Inbox from "./Inbox.svelte"

  export let SERVER_URL: string
  let isLoading = true

  onMount(async () => {
    const currentToken = localStorage.getItem("token")
    if (!currentToken) return (isLoading = false)

    try {
      const response = await axios.request<{ username: string }>({
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        url: `${SERVER_URL}/auth/verify`,
      })

      token.set(currentToken)
      username.set(response.data.username)

      isLoading = false
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        alert(error.response.data)
      localStorage.removeItem("token")

      isLoading = false
    }
  })
</script>

{#if isLoading}
  <p class="text-white">Loading...</p>
{:else if $token}
  <Inbox {SERVER_URL} />
{:else}
  <Login {SERVER_URL} />
{/if}
