<script lang="ts">
  import axios, { AxiosError } from "axios"
  import { token, username } from "../stores"

  export let SERVER_URL: string
  let currUsername = ""

  async function handleSubmit() {
    if (!currUsername) return

    try {
      const response = await axios.request<{
        id: string
        username: string
        token: string
      }>({
        method: "POST",
        url: `${SERVER_URL}/auth/login`,
        data: { username: currUsername },
      })

      localStorage.setItem("id", response.data.id)
      localStorage.setItem("username", response.data.username)
      localStorage.setItem("token", response.data.token)

      username.set(response.data.username)
      token.set(response.data.token)
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        alert(error.response.data)
    }
  }
</script>

<div class="flex flex-col">
  <label for="username" class="text-white">Username</label>
  <input
    id="username"
    type="text"
    placeholder="enter your name"
    bind:value={currUsername}
    on:keyup={(e) => e.key === "Enter" && handleSubmit()}
    autocomplete="off"
  />
  <button class="bg-slate-600 text-white" on:click={handleSubmit}>Log in</button
  >
</div>
