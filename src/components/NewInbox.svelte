<script lang="ts">
  import axios, { AxiosError } from "axios"
  import { onMount } from "svelte"

  export let SERVER_URL: string
  let isLoading = true

  onMount(async () => {
    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      location.replace("/")
      isLoading = false
      return
    }

    try {
      // const response = await axios.request<{ username: string }>({
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${currentToken}` },
      //   url: `${SERVER_URL}/auth/verify`,
      // })

      // token.set(currentToken)
      // username.set(response.data.username)

      const response = await axios.request<{ inboxId: string }>({
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        url: `${SERVER_URL}/inbox/create`,
      })

      location.replace(`/inbox/${response.data.inboxId}`)

      isLoading = false
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        alert(error.response.data)
      location.replace("/")
      isLoading = false
    }
  })
</script>

{#if isLoading}
  <p class="text-white">Loading...</p>
{:else}
  <div class="text-white">new</div>
{/if}
