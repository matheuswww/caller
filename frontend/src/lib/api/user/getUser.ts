import { API_URL } from "../api"

export interface getUserResponse {
  user_id: string
  name: string
  user: string
  img: string
}

export default async function getUser():Promise<getUserResponse> {
  const url = `${API_URL}/user/getUser`
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const text = await res.text()
    if (text && res.status == 200) {
      const res:getUserResponse = JSON.parse(text)
      return res 
    }
    throw new Error()
  })

  return res
}