import { API_URL } from "../api"

export interface searchUserResponse {
  user_id: string
  name: string
  user: string
}

interface searchUserRequest {
  user: string
}

export default async function searchUser(user: searchUserRequest):Promise<searchUserResponse[]> {
  const url = `${API_URL}/user/searchUser?user=${user.user}`
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const text = await res.text()
    if (text && res.status == 200) {
      const res:searchUserResponse[] = JSON.parse(text)
      return res 
    }
    if (res.status === 404) {
      return []
    }
    throw new Error()
  })

  return res
}