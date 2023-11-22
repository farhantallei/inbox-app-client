<script lang="ts">
  import axios, { AxiosError } from "axios"
  import { token, username } from "../stores"

  export let SERVER_URL: string

  // let usersPromise = getUserList()
  let inboxesPromise = getInboxList()

  function handleLogout() {
    axios.request<{ token: string }>({
      method: "POST",
      headers: { Authorization: `Bearer ${$token}` },
      url: `${SERVER_URL}/auth/logout`,
    })

    localStorage.removeItem("token")
    resetToken()
  }

  function resetToken() {
    token.reset()
  }

  // async function getUserList() {
  //   try {
  //     const response = await axios.request<{ id: string; username: string }[]>({
  //       headers: { Authorization: `Bearer ${$token}` },
  //       url: `${SERVER_URL}/user/list`,
  //     })

  //     return response.data
  //   } catch (error) {
  //     if (error instanceof AxiosError && error.response)
  //       throw new Error(error.response.data)

  //     throw new Error("Internal server error")
  //   }
  // }

  async function getInboxList() {
    try {
      const response = await axios.request<{ id: string; userId: string }[]>({
        headers: { Authorization: `Bearer ${$token}` },
        url: `${SERVER_URL}/inbox/list`,
      })

      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        throw new Error(error.response.data)

      throw new Error("Internal server error")
    }
  }
</script>

<div class="text-white w-full max-w-lg flex flex-col">
  <nav class="flex justify-between">
    <div>Welcome, {$username}</div>
    <div class="flex gap-x-2">
      <a href="new">New</a>
      <button on:click={handleLogout}>Logout</button>
    </div>
  </nav>
  <div class="border-b border-gray-700" />

  <!-- {#await usersPromise}
    <p>Waiting...</p>
  {:then users}
    <div class="flex gap-x-2">
      {#each users as { id, username } (id)}
        <div class="bg-red-400">{username}</div>
      {/each}
    </div>
  {/await} -->

  {#await inboxesPromise}
    <p>Waiting...</p>
  {:then inboxes}
    <div class="flex flex-col gap-y-2 mt-2">
      {#each inboxes as inbox (inbox.id)}
        <a class="bg-red-400" href={`inbox/${inbox.id}`}>{inbox.id}</a>
      {/each}
    </div>
  {:catch error}
    <p>An error occurred!</p>
    <p>{error}</p>
  {/await}
</div>
