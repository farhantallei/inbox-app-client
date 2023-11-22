<script lang="ts">
  import { createQuery, useQueryClient } from "@tanstack/svelte-query"
  import axios, { AxiosError } from "axios"
  import { onMount } from "svelte"
  // import { inbox } from "../stores"

  export let SERVER_URL: string
  export let WEBSOCKET_URL: string
  export let inboxId: string

  // let inboxPromise = getInbox()

  let usersPromise = getUserList()
  let isLoading = true
  let token: string | null = localStorage.getItem("token")
  let username: string | null = localStorage.getItem("username")
  let userId: string | null = localStorage.getItem("id")
  let dialog: HTMLDialogElement
  let usersChecked: string[] = []
  let message = ""

  const client = useQueryClient()

  const inboxWs = new WebSocket(`${WEBSOCKET_URL}/inbox/join`)
  const chatWs = new WebSocket(
    `${WEBSOCKET_URL}/inbox/send-message?inboxId=${inboxId}&userId=${userId}&username=${username}`
  )

  const inboxQuery = createQuery({
    queryKey: ["inbox", inboxId],
    queryFn: async () => {
      const response = await axios.request<{
        friends: { id: string; username: string | null }[]
        messages: {
          id: string
          username: string | null
          message: string | null
        }[]
      }>({
        url: `${SERVER_URL}/inbox/${inboxId}`,
        headers: { Authorization: `Bearer ${token}` },
      })

      return response.data
    },
  })

  onMount(async () => {
    if (!token) {
      location.replace("/")
      isLoading = false
      return
    }

    try {
      await axios.request<{ username: string }>({
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        url: `${SERVER_URL}/auth/verify`,
      })

      isLoading = false
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        alert(error.response.data)
      localStorage.removeItem("token")

      isLoading = false
    }
  })

  onMount(() => {
    inboxWs.addEventListener("open", () => {
      console.log("Connected to the inbox socket")
      inboxWs.send(JSON.stringify({ inboxId }))
    })

    chatWs.addEventListener("open", () => {
      console.log("Connected to the inbox socket")
    })

    chatWs.addEventListener("message", ({ data }) => {
      // console.log("Receive message:", data)
      // inboxPromise

      if (JSON.parse(data).username === username) message = ""

      client.setQueryData<{
        friends: { id: string; username: string | null }[]
        messages: {
          id: string
          username: string | null
          message: string | null
        }[]
      }>(["inbox", inboxId], (prev) => {
        if (prev) {
          const newData = structuredClone(prev)

          newData.messages.push(JSON.parse(data))

          return newData
        }
      })
    })
  })

  // async function getInbox() {
  //   const token = localStorage.getItem("token")
  //   try {
  //     if (!token) {
  //       throw new Error("Token is required")
  //     }

  //     const response = await axios.get<{
  //       friends: { id: string; username: string | null }[]
  //       messages: {
  //         id: string
  //         username: string | null
  //         message: string | null
  //       }[]
  //     }>(`${SERVER_URL}/inbox/${inboxId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })

  //     return response.data
  //   } catch (error) {
  //     if (error instanceof AxiosError && error.response)
  //       throw new Error(error.response.data)

  //     throw new Error("Internal server error")
  //   }
  // }

  async function getUserList() {
    const token = localStorage.getItem("token")
    try {
      if (!token) {
        throw new Error("Token is required")
      }

      const response = await axios.request<
        { id: string; username: string | null }[]
      >({
        headers: { Authorization: `Bearer ${token}` },
        url: `${SERVER_URL}/user/list`,
      })

      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        throw new Error(error.response.data)

      throw new Error("Internal server error")
    }
  }

  async function handleInviteSubmit() {
    await axios.request({
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      url: `${SERVER_URL}/inbox/${inboxId}/invite`,
      data: { userIds: usersChecked },
    })

    // inboxPromise = getInbox()

    $inboxQuery.refetch()

    usersChecked = []
  }

  function handleSendMessage() {
    chatWs.send(JSON.stringify({ message }))
  }
</script>

<dialog bind:this={dialog} class="p-2">
  <form method="dialog" on:submit={handleInviteSubmit}>
    {#await usersPromise}
      <p>Waiting...</p>
    {:then users}
      <div class="flex gap-x-2">
        {#each users as user (user.id)}
          <div class="bg-red-400">
            <input
              type="checkbox"
              id={user.id}
              name="friend"
              value={user.id}
              bind:group={usersChecked}
            />
            <label for={user.id}>{user.username}</label>
          </div>
        {/each}
      </div>
    {/await}

    <div class="flex gap-x-2 justify-end">
      <button
        type="button"
        on:click={() => {
          usersChecked = []
          dialog.close()
        }}>Close</button
      >
      <button disabled={!usersChecked.length}>Invite</button>
    </div>
  </form>
</dialog>

<div class="text-white w-full max-w-lg flex flex-col">
  <nav class="flex justify-between">
    <div>Chat</div>
    <div class="flex gap-x-2">
      <button on:click={() => dialog.showModal()}>Invite</button>
      <a href="/">Back</a>
    </div>
  </nav>
  <div class="border-b border-gray-700" />

  {#if $inboxQuery.isLoading}
    <p>Waiting...</p>
  {:else if $inboxQuery.isError}
    <p>An error occurred!</p>
    <p>Error: {$inboxQuery.error.message}</p>
  {:else if $inboxQuery.isSuccess}
    <div>participants:</div>
    <div class="flex gap-x-2 mb-2">
      {#each $inboxQuery.data.friends as friend (friend.id)}
        <div class="bg-red-400">{friend.username}</div>
      {/each}
    </div>
    <div class="border-b border-gray-700" />
    <div class="h-[400px] border">
      {#each $inboxQuery.data.messages as message (message.id)}
        <div
          class={`border-b border-b-slate-600 ${
            username === message.username ? "bg-violet-600" : "bg-red-400"
          }`}
        >
          <div>{message.username}</div>
          <div>{message.message}</div>
        </div>
      {/each}
    </div>

    <div class="flex gap-x-2">
      <input
        id="message"
        type="text"
        class="flex-1 text-black"
        placeholder="message"
        autofocus
        bind:value={message}
        autocomplete="off"
        on:keyup={(e) => e.key === "Enter" && !!message && handleSendMessage()}
      />
      <button disabled={!message} on:click={handleSendMessage}>send</button>
    </div>
  {/if}
</div>
