import { API_URL } from "../api"
import { InvalidCookie } from "../error"

export interface getFriendsResponse {
  friends: friendsResponse[]
  requests: friendsResponse[]
  last_user: string
  next: boolean
}

export interface friendsResponse {
  user_id: string
  name: string
  user: string
  img: null
}

export async function getFriends(): Promise<getFriendsResponse> {
  const url = `${API_URL}/friend/getFriends`
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then(async (res) => {
    if (res.status === 401) {
      throw new InvalidCookie()
    }
    if (res.status === 404) {
      return {
        friends: [],
        requests: [],
        last_user: "",
        next: false
      }
    }
    const text = await res.text()
    if (text && res.status == 200) {
      const res:getFriendsResponse = JSON.parse(text)
      return res
    }
    throw new Error()
  })
  return res
}