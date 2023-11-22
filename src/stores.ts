import { writable } from "svelte/store"

function createToken() {
  const { subscribe, set, update } = writable<string | null>(null)

  return {
    subscribe,
    set(token: string) {
      update(() => token)
    },
    reset() {
      set(null)
    },
  }
}

export const token = createToken()

function createUsername() {
  const { subscribe, update } = writable<string>()

  return {
    subscribe,
    set(username: string) {
      update(() => username)
    },
  }
}

export const username = createUsername()

function createInbox() {
  const { subscribe, update } = writable<string>()

  return {
    subscribe,
    set(inboxId: string) {
      update(() => inboxId)
    },
  }
}

export const inbox = createInbox()
